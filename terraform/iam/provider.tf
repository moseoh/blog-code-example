terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region  = "ap-northeast-2"
  profile = "admin"
}

variable "account_id" {
  type        = string
  description = "AWS 계정 ID"
}

variable "identity_store_id" {
  type        = string
  description = "AWS IAM Identity Center의 Identity Store ID"
}

variable "identity_center_arn" {
  type        = string
  description = "AWS IAM Identity Center의 Instance ARN"
}
