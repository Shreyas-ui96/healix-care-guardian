import { Helmet } from "react-helmet";
import { useState } from "react";
import Header from "@/components/Header";
import PanicButton from "@/components/PanicButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Upload,
  Download,
  Share2,
  Clock,
  Heart,
  Activity,
  Pill,
  TestTube,
  Calendar,
  Lock,
  Search,
  Filter,
  Eye,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";

const Records = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handlePanic = () => {
    console.log("Emergency services activated");
  };

  const handleUpload = () => {
    toast.success("Upload Started", {
      description: "Your medical records are being uploaded securely.",
    });
  };

  const handleShare = () => {
    toast.info("Share Records", {
      description: "Generate a secure link to share your records.",
    });
  };

  const medicalRecords = [
    {
      id: 1,
      type: "Prescription",
      title: "Blood Pressure Medication",
      date: "2026-01-08",
      doctor: "Dr. Sarah Johnson",
      icon: Pill,
      color: "from-blue-500 to-cyan-400",
      status: "Active",
    },
    {
      id: 2,
      type: "Lab Report",
      title: "Complete Blood Count (CBC)",
      date: "2026-01-05",
      doctor: "Dr. Michael Chen",
      icon: TestTube,
      color: "from-purple-500 to-pink-400",
      status: "Completed",
    },
    {
      id: 3,
      type: "Consultation",
      title: "Annual Physical Examination",
      date: "2025-12-20",
      doctor: "Dr. Emily Rodriguez",
      icon: Activity,
      color: "from-green-500 to-emerald-400",
      status: "Completed",
    },
    {
      id: 4,
      type: "Imaging",
      title: "Chest X-Ray",
      date: "2025-11-15",
      doctor: "Dr. James Wilson",
      icon: FileCheck,
      color: "from-orange-500 to-red-400",
      status: "Completed",
    },
  ];

  const vitalStats = [
    { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: Heart, trend: "normal" },
    { label: "Heart Rate", value: "72", unit: "bpm", icon: Activity, trend: "normal" },
    { label: "Weight", value: "75", unit: "kg", icon: Activity, trend: "stable" },
    { label: "Temperature", value: "98.6", unit: "°F", icon: Activity, trend: "normal" },
  ];

  const upcomingAppointments = [
    { date: "2026-01-15", time: "10:00 AM", doctor: "Dr. Sarah Johnson", type: "Follow-up" },
    { date: "2026-01-22", time: "2:30 PM", doctor: "Dr. Michael Chen", type: "Lab Review" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Medical Records | Healix - Secure Health Records Management</title>
        <meta name="description" content="Access, manage, and share your medical records securely with Healix's encrypted health records system." />
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <Badge variant="outline" className="mb-2">Health Records</Badge>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Your Medical
                <span className="text-gradient-primary"> Records</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Securely manage and access your complete health history
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="hero" onClick={handleUpload} className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Record
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search medical records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </section>

        {/* Vital Statistics */}
        <section className="container mx-auto px-4 mb-12">
          <h2 className="font-display text-2xl font-bold mb-6">Current Vital Signs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vitalStats.map((stat, index) => (
              <Card key={index} className="bg-glass border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <stat.icon className="w-5 h-5 text-primary" />
                    <Badge variant="outline" className="text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {stat.value}
                      <span className="text-sm text-muted-foreground ml-1">{stat.unit}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="records" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>

            {/* Medical Records Tab */}
            <TabsContent value="records" className="space-y-4">
              <div className="grid gap-4">
                {medicalRecords.map((record) => (
                  <Card 
                    key={record.id}
                    className="bg-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${record.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-glow`}>
                          <record.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">{record.title}</h3>
                              <p className="text-sm text-muted-foreground">{record.doctor}</p>
                            </div>
                            <Badge variant="outline">{record.status}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {record.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="space-y-4">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled medical appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.doctor}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge variant="outline" className="mt-1">{appointment.type}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Reschedule</Button>
                    </div>
                  ))}
                  <Button variant="hero" className="w-full mt-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="space-y-4">
              <Card className="bg-glass border-border/50">
                <CardHeader>
                  <CardTitle>Active Prescriptions</CardTitle>
                  <CardDescription>Your current medications and dosages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: "Lisinopril 10mg", dosage: "Once daily", refills: "3 refills left" },
                      { name: "Metformin 500mg", dosage: "Twice daily", refills: "5 refills left" },
                    ].map((prescription, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <Pill className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{prescription.name}</h4>
                            <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
                            <p className="text-xs text-muted-foreground mt-1">{prescription.refills}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Refill</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Security Notice */}
        <section className="container mx-auto px-4 mt-12">
          <Card className="bg-glass border-primary/30">
            <CardContent className="p-6 flex items-start gap-4">
              <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Your Data is Secure</h3>
                <p className="text-sm text-muted-foreground">
                  All medical records are encrypted end-to-end and comply with HIPAA regulations. 
                  Only you and authorized healthcare providers can access your information.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <PanicButton onActivate={handlePanic} />
    </div>
  );
};

export default Records;
