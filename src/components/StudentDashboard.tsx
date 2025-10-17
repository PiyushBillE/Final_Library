import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, BarChart3, LogOut } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

type User = {
  id?: string;
  role: 'student' | 'librarian';
  accessToken?: string;
  email?: string;
};

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

interface StudentData {
  name: string;
  prn: string;
  libraryNumber: string;
  course: string;
  email: string;
  mobile: string;
  photoUrl?: string;
  admittedYear: string;
  rollNumber: string;
  gender: string;
  bloodGroup: string;
  category: string;
  dateOfBirth: string;
  parentMobile: string;
  permanentAddress: string;
  localAddress: string;
}

interface DashboardStats {
  totalStudents: number;
  courseDistribution: Record<string, number>;
}

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile'>('dashboard');
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      console.log('Fetching student data with token:', user.accessToken);
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-374bb1bc/student-profile`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        }
      });

      const result = await response.json();
      console.log('Student data response:', result);
      if (result.success) {
        setStudentData(result.student);
      } else {
        console.error('Failed to fetch student data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
    setLoading(false);
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {studentData && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={studentData.photoUrl} />
                  <AvatarFallback className="text-lg">
                    {studentData.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-semibold">{studentData.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      {studentData.libraryNumber}
                    </Badge>
                    <Badge variant="outline">{studentData.course}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>PRN Number</Label>
                    <p className="font-medium">{studentData.prn}</p>
                  </div>
                  <div>
                    <Label>Roll Number</Label>
                    <p className="font-medium">{studentData.rollNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="font-medium">{studentData.gender}</p>
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <p className="font-medium">{studentData.bloodGroup}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="font-medium">{studentData.category}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p className="font-medium">
                      {studentData.dateOfBirth ? new Date(studentData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Academic Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Academic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Course</Label>
                    <p className="font-medium">{studentData.course}</p>
                  </div>
                  <div>
                    <Label>Admitted Year</Label>
                    <p className="font-medium">{studentData.admittedYear}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="font-medium">{studentData.email}</p>
                  </div>
                  <div>
                    <Label>Mobile Number</Label>
                    <p className="font-medium">{studentData.mobile}</p>
                  </div>
                  <div>
                    <Label>Parent Mobile</Label>
                    <p className="font-medium">{studentData.parentMobile || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Address Information</h4>
                <div className="space-y-4">
                  <div>
                    <Label>Permanent Address</Label>
                    <p className="font-medium">{studentData.permanentAddress || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Local Address</Label>
                    <p className="font-medium">{studentData.localAddress || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Student Info Cards - Only Course and Library Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Course</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData?.course || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Your enrolled course
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Library Number</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData?.libraryNumber || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">
              Your unique library ID
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to BVDUET Library System</CardTitle>
          <CardDescription>
            Access library resources and manage your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Hello <strong>{studentData?.name}</strong>, welcome to the Bharati Vidyapeeth Deemed to be University Navi Mumbai Library System.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Library Services</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Book borrowing and returns</li>
                  <li>• Digital resource access</li>
                  <li>• Study room reservations</li>
                  <li>• Research assistance</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Quick Info</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Course:</strong> {studentData?.course}</p>
                  <p><strong>Library ID:</strong> {studentData?.libraryNumber}</p>
                  <p><strong>Email:</strong> {studentData?.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> To make changes to your profile information, please contact the librarian. 
                Use the "My Profile" section to view all your details.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant={currentView === 'dashboard' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCurrentView('dashboard')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            
            <Button 
              variant={currentView === 'profile' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setCurrentView('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              My Profile
            </Button>
            
            <h1 className="text-xl font-semibold">BVDUET Library System</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {studentData?.name || 'Student'}
            </span>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {currentView === 'profile' ? renderProfile() : renderDashboard()}
      </main>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-medium text-muted-foreground">{children}</span>;
}