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
        <title>Medical Records | Synkcare - Secure Health Records Management</title>
        <meta name="description" content="Access, manage, and share your medical records securely with Synkcare's encrypted health records system." />
      </Helmet>
      
      <Header />
      
      <main className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <Badge variant="outline" className="mb-2 text-xs">Health Records</Badge>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                Your Medical
                <span className="text-gradient-primary"> Records</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                Securely manage and access your complete health history
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button variant="outline" onClick={handleShare} className="gap-1.5 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
                <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Share
              </Button>
              <Button variant="hero" onClick={handleUpload} className="gap-1.5 sm:gap-2 flex-1 sm:flex-none text-xs sm:text-sm">
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Upload
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search medical records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Button variant="outline" className="gap-2 text-xs sm:text-sm">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Filter
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mb-8 sm:mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Current Vital Signs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {vitalStats.map((stat, index) => (
              <Card key={index} className="bg-glass border-border/50">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="text-lg sm:text-2xl font-bold">
                      {stat.value}
                      <span className="text-[10px] sm:text-sm text-muted-foreground ml-0.5 sm:ml-1">{stat.unit}</span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-3 sm:px-4">
          <Tabs defaultValue="records" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px] h-9 sm:h-10">
              <TabsTrigger value="records" className="text-xs sm:text-sm">Records</TabsTrigger>
              <TabsTrigger value="appointments" className="text-xs sm:text-sm">Appointments</TabsTrigger>
              <TabsTrigger value="prescriptions" className="text-xs sm:text-sm">Prescriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="records" className="space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4">
                {medicalRecords.map((record) => (
                  <Card 
                    key={record.id}
                    className="bg-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${record.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-glow`}>
                          <record.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        
                        <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm sm:text-lg truncate">{record.title}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">{record.doctor}</p>
                            </div>
                            <Badge variant="outline" className="text-[10px] sm:text-xs shrink-0">{record.status}</Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(record.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                              {record.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                          <Button variant="outline" size="sm" className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1.5 flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
                            <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-3 sm:space-y-4">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Upcoming Appointments</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your scheduled medical appointments</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  {upcomingAppointments.map((appointment, index) => (
                    <div 
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-card rounded-lg border border-border/50 gap-3"
                    >
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base">{appointment.doctor}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                          <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">{appointment.type}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">Reschedule</Button>
                    </div>
                  ))}
                  <Button variant="hero" className="w-full mt-2 sm:mt-4 text-xs sm:text-sm">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    Book New Appointment
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-3 sm:space-y-4">
              <Card className="bg-glass border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">Active Prescriptions</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Your current medications and dosages</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { name: "Lisinopril 10mg", dosage: "Once daily", refills: "3 refills left" },
                      { name: "Metformin 500mg", dosage: "Twice daily", refills: "5 refills left" },
                    ].map((prescription, index) => (
                      <div 
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-card rounded-lg border border-border/50 gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
                            <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm sm:text-base">{prescription.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">{prescription.dosage}</p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">{prescription.refills}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">Refill</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="container mx-auto px-3 sm:px-4 mt-8 sm:mt-12">
          <Card className="bg-glass border-primary/30">
            <CardContent className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Your Data is Secure</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
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
