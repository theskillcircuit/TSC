import requests
import sys
import json
from datetime import datetime

class SkillCircuitAPITester:
    def __init__(self, base_url="https://edtech-platform-30.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    details += f" - {response.text[:100]}"
            
            self.log_test(name, success, details)
            
            if success and response.content:
                try:
                    return True, response.json()
                except:
                    return True, response.text
            return success, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_seed_database(self):
        """Test database seeding"""
        print("\n🌱 Testing Database Seeding...")
        success, response = self.run_test(
            "Seed Database",
            "POST",
            "seed",
            200
        )
        return success

    def test_admin_login(self):
        """Test admin login"""
        print("\n🔐 Testing Admin Authentication...")
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@skillcircuit.com", "password": "admin123"}
        )
        
        if success and 'access_token' in response:
            self.admin_token = response['access_token']
            return True
        return False

    def test_courses_endpoints(self):
        """Test courses endpoints"""
        print("\n📚 Testing Courses Endpoints...")
        
        # Get all courses
        self.run_test("Get All Courses", "GET", "courses", 200)
        
        # Get courses by category
        categories = ['neo', 'sprint', 'pathway', 'launchpad']
        for category in categories:
            self.run_test(
                f"Get {category.title()} Courses",
                "GET",
                f"courses?category={category}",
                200
            )
        
        # Get specific course (we'll use the first course from seeded data)
        success, courses = self.run_test("Get Courses for ID Test", "GET", "courses", 200)
        if success and courses and len(courses) > 0:
            course_id = courses[0]['course_id']
            self.run_test(
                "Get Course Details",
                "GET",
                f"courses/{course_id}",
                200
            )

    def test_cms_endpoints(self):
        """Test CMS endpoints"""
        print("\n📄 Testing CMS Endpoints...")
        
        # Test CMS content retrieval
        self.run_test("Get Home CMS Content", "GET", "cms/home", 200)
        self.run_test("Get About CMS Content", "GET", "cms/about", 200)

    def test_contact_endpoint(self):
        """Test contact form submission"""
        print("\n📧 Testing Contact Endpoint...")
        
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "+1234567890",
            "message": "This is a test contact submission"
        }
        
        self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )

    def test_admin_endpoints(self):
        """Test admin-only endpoints"""
        print("\n👑 Testing Admin Endpoints...")
        
        if not self.admin_token:
            print("❌ No admin token available, skipping admin tests")
            return
        
        admin_headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        # Test analytics
        self.run_test(
            "Get Admin Analytics",
            "GET",
            "admin/analytics",
            200,
            headers=admin_headers
        )
        
        # Test students list
        self.run_test(
            "Get Students List",
            "GET",
            "admin/students",
            200,
            headers=admin_headers
        )
        
        # Test contacts list
        self.run_test(
            "Get Contacts List",
            "GET",
            "admin/contacts",
            200,
            headers=admin_headers
        )

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔑 Testing Auth Endpoints...")
        
        # Test user registration
        test_user_data = {
            "email": f"testuser_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "name": "Test User",
            "role": "student"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            
            # Test getting current user info
            user_headers = {'Authorization': f'Bearer {self.token}'}
            self.run_test(
                "Get Current User Info",
                "GET",
                "auth/me",
                200,
                headers=user_headers
            )

    def test_live_classes_endpoint(self):
        """Test live classes endpoint"""
        print("\n🎥 Testing Live Classes Endpoint...")
        
        self.run_test("Get Live Classes", "GET", "live-classes", 200)

    def test_health_check(self):
        """Test basic health check"""
        print("\n🏥 Testing Health Check...")
        
        try:
            response = requests.get(f"{self.base_url}/", timeout=5)
            success = response.status_code in [200, 404]  # 404 is ok for root endpoint
            self.log_test("Backend Health Check", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Error: {str(e)}")

    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Skill Circuit API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Basic health check
        self.test_health_check()
        
        # Seed database first
        self.test_seed_database()
        
        # Test public endpoints
        self.test_courses_endpoints()
        self.test_cms_endpoints()
        self.test_contact_endpoint()
        self.test_live_classes_endpoint()
        
        # Test authentication
        self.test_auth_endpoints()
        
        # Test admin functionality
        self.test_admin_login()
        self.test_admin_endpoints()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = SkillCircuitAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': (tester.tests_passed/tester.tests_run*100) if tester.tests_run > 0 else 0,
                'timestamp': datetime.now().isoformat()
            },
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())