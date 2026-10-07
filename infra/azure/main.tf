terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id

  features {}
}

variable "subscription_id" {
  description = "Azure subscription ID to deploy into."
  type        = string
}

variable "location" {
  description = "Azure region for the resources."
  type        = string
  default     = "eastus"
}

variable "ssh_source_cidr" {
  description = "Your public IPv4 address in CIDR form."
  type        = string

  validation {
    condition     = can(cidrnetmask(var.ssh_source_cidr))
    error_message = "Please set ssh_source_cidr to a valid IPv4 CIDR range."
  }
}

variable "ssh_public_key_path" {
  description = "Path to your SSH public key, such as ~/.ssh/id_ed25519.pub."
  type        = string
}

variable "db_admin_username" {
  description = "Administrator login for Azure SQL."
  type        = string
  default     = "dbadmin"
}

variable "db_admin_password" {
  description = "Strong password for Azure SQL. Terraform state will contain this value."
  type        = string
  sensitive   = true

  validation {
    condition = (
      length(var.db_admin_password) >= 12 &&
      length(regexall("[A-Z]", var.db_admin_password)) > 0 &&
      length(regexall("[a-z]", var.db_admin_password)) > 0 &&
      length(regexall("[0-9]", var.db_admin_password)) > 0 &&
      length(regexall("[^A-Za-z0-9]", var.db_admin_password)) > 0
    )
    error_message = "Use at least 12 characters with uppercase, lowercase, numeric, and special characters."
  }
}

resource "random_string" "suffix" {
  length  = 6
  lower   = true
  upper   = false
  numeric = true
  special = false
}

resource "azurerm_resource_group" "app" {
  name     = "todo-app-rg"
  location = var.location
}

resource "azurerm_virtual_network" "app" {
  name                = "todo-app-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
}

resource "azurerm_subnet" "app" {
  name                 = "app-subnet"
  resource_group_name  = azurerm_resource_group.app.name
  virtual_network_name = azurerm_virtual_network.app.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_subnet" "db_private" {
  name                              = "db-private-subnet"
  resource_group_name               = azurerm_resource_group.app.name
  virtual_network_name              = azurerm_virtual_network.app.name
  address_prefixes                  = ["10.0.2.0/24"]
  private_endpoint_network_policies = "Enabled"
}

resource "azurerm_network_security_group" "app" {
  name                = "todo-app-nsg"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name

  security_rule {
    name                       = "Allow-SSH-From-My-IP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.ssh_source_cidr
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "Allow-HTTP"
    priority                   = 110
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "Allow-HTTPS"
    priority                   = 120
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "app" {
  subnet_id                 = azurerm_subnet.app.id
  network_security_group_id = azurerm_network_security_group.app.id
}

resource "azurerm_network_security_group" "db" {
  name                = "todo-app-db-nsg"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name

  security_rule {
    name                       = "Allow-SQL"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "1433"
    source_address_prefix      = "10.0.1.4"
    destination_address_prefix = "*"
  }
}

resource "azurerm_subnet_network_security_group_association" "db" {
  subnet_id                 = azurerm_subnet.db_private.id
  network_security_group_id = azurerm_network_security_group.db.id
}

// nic doesn't get assigned public ip automatically in azure
resource "azurerm_public_ip" "app" {
  name                = "todo-app-ip"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_interface" "app" {
  name                = "todo-app-nic"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.app.id
    private_ip_address_allocation = "Static"
    private_ip_address            = "10.0.1.4"
    public_ip_address_id          = azurerm_public_ip.app.id
  }
}

resource "azurerm_linux_virtual_machine" "app" {
  name                            = "todo-app-vm"
  computer_name                   = "todo-app-vm"
  resource_group_name             = azurerm_resource_group.app.name
  location                        = azurerm_resource_group.app.location
  size                            = "Standard_B1s"
  admin_username                  = "azureuser"
  disable_password_authentication = true
  network_interface_ids           = [azurerm_network_interface.app.id]

  admin_ssh_key {
    username   = "azureuser"
    public_key = file(var.ssh_public_key_path)
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "ubuntu-24_04-lts"
    sku       = "server"
    version   = "latest"
  }
}

resource "azurerm_storage_account" "frontend" {
  name                            = "todo-app-${random_string.suffix.result}"
  resource_group_name             = azurerm_resource_group.app.name
  location                        = azurerm_resource_group.app.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  account_kind                    = "StorageV2"
  https_traffic_only_enabled      = true
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
}

resource "azurerm_storage_account_static_website" "frontend" {
  storage_account_id = azurerm_storage_account.frontend.id
  index_document     = "index.html"
  error_404_document = "index.html"
}

resource "azurerm_mssql_server" "app" {
  name                          = "todo-app-db-${random_string.suffix.result}"
  resource_group_name           = azurerm_resource_group.app.name
  location                      = azurerm_resource_group.app.location
  version                       = "12.0"
  administrator_login           = var.db_admin_username
  administrator_login_password  = var.db_admin_password
  minimum_tls_version           = "1.2"
  public_network_access_enabled = false
}

resource "azurerm_mssql_database" "app" {
  name           = "TodoApp"
  server_id      = azurerm_mssql_server.app.id
  sku_name       = "Basic"
  max_size_gb    = 2
  zone_redundant = false
}

resource "azurerm_private_dns_zone" "db" {
  name                = "privatelink.database.windows.net"
  resource_group_name = azurerm_resource_group.app.name
}

resource "azurerm_private_dns_zone_virtual_network_link" "db" {
  name                  = "todo-db-private-dns-link"
  resource_group_name   = azurerm_resource_group.app.name
  private_dns_zone_name = azurerm_private_dns_zone.db.name
  virtual_network_id    = azurerm_virtual_network.app.id
  registration_enabled  = false
}

resource "azurerm_private_endpoint" "db" {
  name                = "todo-db-private-endpoint"
  location            = azurerm_resource_group.app.location
  resource_group_name = azurerm_resource_group.app.name
  subnet_id           = azurerm_subnet.db_private.id

  private_service_connection {
    name                           = "todo-db-private-connection"
    private_connection_resource_id = azurerm_mssql_server.app.id
    is_manual_connection           = false
    subresource_names              = ["sqlServer"]
  }

  private_dns_zone_group {
    name                 = "db-private-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.db.id]
  }

  depends_on = [azurerm_private_dns_zone_virtual_network_link.db]
}

output "frontend_url" {
  description = "Upload frontend/dist to the storage account's $web container, then open this URL."
  value       = azurerm_storage_account.frontend.primary_web_endpoint
  depends_on  = [azurerm_storage_account_static_website.frontend]
}

output "storage_account_name" {
  description = "Storage account name for uploading the built React files."
  value       = azurerm_storage_account.frontend.name
}

output "api_vm_public_ip" {
  description = "Public IP of the Linux VM for SSH and API setup."
  value       = azurerm_public_ip.app.ip_address
}

output "api_vm_ssh_command" {
  description = "SSH command for the Linux VM."
  value       = "ssh azureuser@${azurerm_public_ip.app.ip_address}"
}

output "db_server_fqdn" {
  description = "Azure SQL hostname; the VNet private DNS link resolves it to the private endpoint."
  value       = azurerm_mssql_server.app.fully_qualified_domain_name
}

output "db_name" {
  value = azurerm_mssql_database.app.name
}
