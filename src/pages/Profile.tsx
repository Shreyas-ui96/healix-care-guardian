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
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <Card className="bg-glass border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start md:items-center">
                <div className="relative">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-primary/20">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="text-xl sm:text-2xl bg-gradient-primary text-primary-foreground">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="hero"
                    className="absolute bottom-0 right-0 rounded-full w-7 h-7 sm:w-8 sm:h-8"
                    onClick={handlePhotoUpload}
                  >
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <h1 className="font-display text-2xl sm:text-3xl font-bold">
                      {formData.firstName} {formData.lastName}
                    </h1>
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm">Member since January 2024</p>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span className="truncate">{formData.email}</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                      <span>{formData.phone}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant={isEditing ? "hero" : "outline"}
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className="gap-1.5 sm:gap-2 w-full sm:w-auto text-xs sm:text-sm mt-2 sm:mt-0"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-lg sm:text-2xl font-bold">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4">
          <Tabs defaultValue="personal" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px] h-9 sm:h-10">
              <TabsTrigger value="personal" className="text-[10px] sm:text-sm px-1 sm:px-3">Personal</TabsTrigger>
              <TabsTrigger value="medical" className="text-[10px] sm:text-sm px-1 sm:px-3">Medical</TabsTrigger>
              <TabsTrigger value="settings" className="text-[10px] sm:text-sm px-1 sm:px-3">Settings</TabsTrigger>
              <TabsTrigger value="activity" className="text-[10px] sm:text-sm px-1 sm:px-3">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 sm:space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Personal Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Update your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="dob" className="text-xs sm:text-sm">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="emergency" className="text-xs sm:text-sm">Emergency Contact</Label>
                      <Input
                        id="emergency"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="address" className="text-xs sm:text-sm">Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className="text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4 sm:space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Medical Information</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your health information for better care</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="bloodType" className="text-xs sm:text-sm">Blood Type</Label>
                      <Input
                        id="bloodType"
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        disabled={!isEditing}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="allergies" className="text-xs sm:text-sm">Allergies</Label>
                      <Input
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        disabled={!isEditing}
                        placeholder="e.g., Penicillin, Peanuts"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  {[
                    { label: "Appointment Reminders", desc: "Get reminded about upcoming appointments" },
                    { label: "Medication Alerts", desc: "Reminders to take your medications" },
                    { label: "Health Tips", desc: "Receive personalized health recommendations" },
                    { label: "Lab Results", desc: "Notifications when lab results are available" },
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-card rounded-lg border border-border/50 gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">{setting.label}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{setting.desc}</p>
                      </div>
                      <Switch defaultChecked className="shrink-0" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Privacy and Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2 sm:space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10">
                    <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2 text-xs sm:text-sm h-9 sm:h-10">
                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Manage Payment Methods
                  </Button>
                  <Button variant="destructive" className="w-full justify-start gap-2 mt-4 sm:mt-6 text-xs sm:text-sm h-9 sm:h-10">
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 sm:space-y-6">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your recent health and medical activities</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border border-border/50"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base">{activity.type}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
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
