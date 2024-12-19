resource "aws_identitystore_group" "developer_group" {
  identity_store_id = var.identity_store_id

  display_name = "developer-group"
  description  = "개발자 용"

}

resource "aws_identitystore_user" "developer_1" {
  identity_store_id = var.identity_store_id

  display_name = "성하 문"
  user_name    = "developer"

  name {
    given_name  = "성하"
    family_name = "문"
  }

  emails {
    value = "azqazq195@gmail.com"
  }

}

resource "aws_identitystore_group_membership" "attach_developer_1" {
  identity_store_id = var.identity_store_id

  group_id  = aws_identitystore_group.developer_group.group_id
  member_id = aws_identitystore_user.developer_1.user_id

}

# 개발자 그룹을 위한 권한 세트 생성
resource "aws_ssoadmin_permission_set" "developer" {
  name             = "SystemAdministratorAccess"
  description      = "System Administrator 권한"
  instance_arn     = var.identity_center_arn
  session_duration = "PT8H"  # 8시간 세션 지속 시간

  tags = {
    Environment = "All"
    ManagedBy   = "Terraform"
  }
}

# 계정 할당 (AWS 계정에 그룹 매핑)
resource "aws_ssoadmin_account_assignment" "developer_assignment" {
  instance_arn       = var.identity_center_arn
  permission_set_arn = aws_ssoadmin_permission_set.developer.arn
  
  principal_id   = aws_identitystore_group.developer_group.group_id
  principal_type = "GROUP"
  
  target_id   = var.account_id
  target_type = "AWS_ACCOUNT"
}

# AWS 관리형 정책 연결 (SystemAdministrator)
resource "aws_ssoadmin_managed_policy_attachment" "developer_policy" {
  depends_on = [aws_ssoadmin_account_assignment.developer_assignment]

  instance_arn       = var.identity_center_arn
  permission_set_arn = aws_ssoadmin_permission_set.developer.arn
  managed_policy_arn = "arn:aws:iam::aws:policy/job-function/SystemAdministrator"
}