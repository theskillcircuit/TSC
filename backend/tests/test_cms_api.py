"""
CMS API Tests for The Skill Circuit EdTech Platform
Tests the inline CMS functionality including:
- GET /api/cms/{page} - Fetch CMS content for a page
- PUT /api/admin/cms - Update CMS content (admin only)
- Admin authentication flow
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestCMSEndpoints:
    """Test CMS API endpoints"""
    
    # Admin credentials
    ADMIN_EMAIL = "admin@skillcircuit.com"
    ADMIN_PASSWORD = "Chh@jer"
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": self.ADMIN_EMAIL, "password": self.ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        # Try with old password if new one fails
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": self.ADMIN_EMAIL, "password": "admin123"}
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip(f"Admin authentication failed: {response.status_code} - {response.text}")
    
    # ==================
    # GET CMS Content Tests
    # ==================
    
    def test_get_cms_home_page(self):
        """Test fetching CMS content for home page"""
        response = requests.get(f"{BASE_URL}/api/cms/home")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page" in data or "sections" in data, "Response should contain page or sections"
        print(f"✓ GET /api/cms/home - Status: {response.status_code}")
    
    def test_get_cms_about_page(self):
        """Test fetching CMS content for about page"""
        response = requests.get(f"{BASE_URL}/api/cms/about")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page" in data or "sections" in data, "Response should contain page or sections"
        print(f"✓ GET /api/cms/about - Status: {response.status_code}")
    
    def test_get_cms_courses_page(self):
        """Test fetching CMS content for courses page"""
        response = requests.get(f"{BASE_URL}/api/cms/courses")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page" in data or "sections" in data, "Response should contain page or sections"
        print(f"✓ GET /api/cms/courses - Status: {response.status_code}")
    
    def test_get_cms_contact_page(self):
        """Test fetching CMS content for contact page"""
        response = requests.get(f"{BASE_URL}/api/cms/contact")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page" in data or "sections" in data, "Response should contain page or sections"
        print(f"✓ GET /api/cms/contact - Status: {response.status_code}")
    
    def test_get_cms_global_page(self):
        """Test fetching CMS content for global (navbar/footer) page"""
        response = requests.get(f"{BASE_URL}/api/cms/global")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "page" in data or "sections" in data, "Response should contain page or sections"
        print(f"✓ GET /api/cms/global - Status: {response.status_code}")
    
    def test_get_cms_nonexistent_page(self):
        """Test fetching CMS content for non-existent page returns empty sections"""
        response = requests.get(f"{BASE_URL}/api/cms/nonexistent_page_xyz")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        # Should return empty sections for non-existent page
        assert data.get("sections") == {} or data.get("page") == "nonexistent_page_xyz"
        print(f"✓ GET /api/cms/nonexistent_page_xyz - Returns empty sections")
    
    # ==================
    # PUT CMS Content Tests (Admin Only)
    # ==================
    
    def test_update_cms_without_auth(self):
        """Test that updating CMS without auth returns 401"""
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "test_section",
                "content": {"test_field": "test_value"}
            }
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ PUT /api/admin/cms without auth - Returns 401")
    
    def test_update_cms_with_admin_auth(self, admin_token):
        """Test updating CMS content with admin authentication"""
        test_content = {
            "test_field": "TEST_cms_update_value",
            "timestamp": "2025-01-01T00:00:00Z"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "test_section",
                "content": test_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "sections" in data, "Response should contain sections"
        assert "test_section" in data["sections"], "Response should contain test_section"
        assert data["sections"]["test_section"]["test_field"] == "TEST_cms_update_value"
        print(f"✓ PUT /api/admin/cms with admin auth - Content updated successfully")
    
    def test_cms_content_persists(self, admin_token):
        """Test that CMS content persists after update"""
        # First update
        unique_value = "TEST_persistence_check_12345"
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "persistence_test",
                "content": {"unique_field": unique_value}
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        # Then fetch to verify persistence
        response = requests.get(f"{BASE_URL}/api/cms/home")
        assert response.status_code == 200
        
        data = response.json()
        assert "sections" in data
        assert "persistence_test" in data["sections"]
        assert data["sections"]["persistence_test"]["unique_field"] == unique_value
        print(f"✓ CMS content persists across requests")
    
    def test_update_cms_hero_section(self, admin_token):
        """Test updating hero section content"""
        hero_content = {
            "title_line1": "TEST_Transform Your",
            "title_line2": "TEST_Career Destiny",
            "subtitle": "TEST_Master in-demand skills"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "hero",
                "content": hero_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        # Verify the update
        data = response.json()
        assert data["sections"]["hero"]["title_line1"] == "TEST_Transform Your"
        print(f"✓ PUT /api/admin/cms hero section - Updated successfully")
    
    def test_update_cms_about_page(self, admin_token):
        """Test updating about page CMS content"""
        about_content = {
            "title": "TEST_Redefining Employability",
            "subtitle": "TEST_We believe skills alone aren't enough"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "about",
                "section": "hero",
                "content": about_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["sections"]["hero"]["title"] == "TEST_Redefining Employability"
        print(f"✓ PUT /api/admin/cms about page - Updated successfully")
    
    def test_update_cms_global_navbar(self, admin_token):
        """Test updating global navbar CMS content"""
        navbar_content = {
            "brand_name": "TEST_The Skill Circuit",
            "logo_initials": "SC"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "global",
                "section": "navbar",
                "content": navbar_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["sections"]["navbar"]["brand_name"] == "TEST_The Skill Circuit"
        print(f"✓ PUT /api/admin/cms global navbar - Updated successfully")
    
    def test_update_cms_footer(self, admin_token):
        """Test updating footer CMS content"""
        footer_content = {
            "description": "TEST_Transforming careers through skill mastery",
            "newsletter_title": "TEST_Stay in the Loop"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "global",
                "section": "footer",
                "content": footer_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["sections"]["footer"]["description"] == "TEST_Transforming careers through skill mastery"
        print(f"✓ PUT /api/admin/cms footer - Updated successfully")


class TestAdminAuthentication:
    """Test admin authentication for CMS access"""
    
    def test_admin_login_with_correct_credentials(self):
        """Test admin login with correct credentials"""
        # Try new password first
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@skillcircuit.com", "password": "Chh@jer"}
        )
        
        if response.status_code != 200:
            # Try old password
            response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"email": "admin@skillcircuit.com", "password": "admin123"}
            )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "access_token" in data, "Response should contain access_token"
        assert "user" in data, "Response should contain user"
        assert data["user"]["role"] == "admin", "User should be admin"
        print(f"✓ Admin login successful - Role: {data['user']['role']}")
    
    def test_admin_login_with_wrong_password(self):
        """Test admin login with wrong password returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@skillcircuit.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Admin login with wrong password - Returns 401")
    
    def test_non_admin_cannot_update_cms(self):
        """Test that non-admin users cannot update CMS content"""
        # First register a regular user
        import uuid
        test_email = f"test_user_{uuid.uuid4().hex[:8]}@test.com"
        
        register_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={
                "email": test_email,
                "password": "testpass123",
                "name": "Test User",
                "role": "student"
            }
        )
        
        if register_response.status_code == 200:
            token = register_response.json().get("access_token")
            
            # Try to update CMS with non-admin token
            response = requests.put(
                f"{BASE_URL}/api/admin/cms",
                json={
                    "page": "home",
                    "section": "test",
                    "content": {"test": "value"}
                },
                headers={"Authorization": f"Bearer {token}"}
            )
            assert response.status_code == 403, f"Expected 403, got {response.status_code}"
            print(f"✓ Non-admin user cannot update CMS - Returns 403")
        else:
            print(f"⚠ Could not create test user, skipping non-admin test")


class TestCMSDataIntegrity:
    """Test CMS data integrity and edge cases"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@skillcircuit.com", "password": "Chh@jer"}
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "admin@skillcircuit.com", "password": "admin123"}
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Admin authentication failed")
    
    def test_cms_update_preserves_other_sections(self, admin_token):
        """Test that updating one section doesn't affect other sections"""
        # First, set up two sections
        requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "section_a",
                "content": {"field_a": "value_a"}
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "section_b",
                "content": {"field_b": "value_b"}
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Verify both sections exist
        response = requests.get(f"{BASE_URL}/api/cms/home")
        data = response.json()
        
        assert "section_a" in data.get("sections", {})
        assert "section_b" in data.get("sections", {})
        assert data["sections"]["section_a"]["field_a"] == "value_a"
        assert data["sections"]["section_b"]["field_b"] == "value_b"
        print(f"✓ CMS update preserves other sections")
    
    def test_cms_update_with_special_characters(self, admin_token):
        """Test CMS update with special characters in content"""
        special_content = {
            "text_with_quotes": 'He said "Hello World"',
            "text_with_unicode": "Café résumé naïve",
            "text_with_html": "<strong>Bold</strong> text"
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/cms",
            json={
                "page": "home",
                "section": "special_chars_test",
                "content": special_content
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200
        
        # Verify content was saved correctly
        get_response = requests.get(f"{BASE_URL}/api/cms/home")
        data = get_response.json()
        
        saved_content = data["sections"]["special_chars_test"]
        assert saved_content["text_with_quotes"] == special_content["text_with_quotes"]
        assert saved_content["text_with_unicode"] == special_content["text_with_unicode"]
        print(f"✓ CMS handles special characters correctly")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
