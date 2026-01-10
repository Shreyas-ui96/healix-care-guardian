import { Helmet } from "react-helmet";
import { useState } from "react";
import Header from "@/components/Header";
import PanicButton from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  Lock,
  CreditCard,
  Heart,
  Activity,
  Upload,
  Settings,
  LogOut,
  Edit,
  Save,
  Camera
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    address: "123 Medical Plaza, Health City, HC 12345",
    emergencyContact: "+1 (555) 987-6543",
    bloodType: "O+",
    allergies: "Penicillin, Peanuts",
  });

  const handlePanic = () => {
    console.log("Emergency services activated");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile Updated", {
      description: "Your profile information has been saved successfully.",
    });
  };

  const handlePhotoUpload = () => {
    toast.info("Upload Photo", {
      description: "Photo upload functionality coming soon.",
    });
  };

  const stats = [
    { label: "Total Consultations", value: "24", icon: Activity },
    { label: "Active Prescriptions", value: "3", icon: Heart },
    { label: "Upcoming Appointments", value: "2", icon: Calendar },
    { label: "Health Score", value: "85/100", icon: Shield },
  ];

  const recentActivity = [
    { type: "Consultation", description: "Video call with Dr. Sarah Johnson", date: "2026-01-08" },
    { type: "Lab Report", description: "Blood test results uploaded", date: "2026-01-05" },
    { type: "Prescription", description: "New prescription added", date: "2026-01-03" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Profile | Healix - Personal Health Dashboard</title>
        <meta name="description" content="Manage your personal information, health data, and account settings on Healix." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Profile Header */}
        <section className="container mx-auto px-4 mb-12">
          <Card className="bg-glass border-border/50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-primary/20">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="hero"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8"
                    onClick={handlePhotoUpload}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="font-display text-3xl font-bold">
                      {formData.firstName} {formData.lastName}
                    </h1>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-4">Member since January 2024</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={isEditing ? "hero" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency">Emergency Contact</Label>
                      <Input
                        id="emergency"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Information Tab */}
            <TabsContent value="medical" className="space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Your health information for better care</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input
                        id="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        disabled={!isEditing}
                        placeholder="e.g., Penicillin, Peanuts"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Appointment Reminders", desc: "Get reminded about upcoming appointments" },
                    { label: "Medication Alerts", desc: "Reminders to take your medications" },
                    { label: "Health Tips", desc: "Receive personalized health recommendations" },
                    { label: "Lab Results", desc: "Notifications when lab results are available" },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <CreditCard className="w-4 h-4" />
                    Manage Payment Methods
                  </Button>
                  <Button variant="destructive" className="w-full justify-start gap-2 mt-6">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your recent health and medical activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{activity.type}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <PanicButton onActivate={handlePanic} />
    </div>
  );
};

export default Profile;
