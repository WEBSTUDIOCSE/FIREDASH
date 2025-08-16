"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Database, Settings, Trash2 } from "lucide-react";

interface FirebaseConfig {
  id: string;
  name: string;
  config: any;
}

export default function Home() {
  const [firebaseConfigs, setFirebaseConfigs] = useState<FirebaseConfig[]>([]);
  const [newConfigName, setNewConfigName] = useState("");
  const [newConfigData, setNewConfigData] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load configs from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("firebase-configs");
    if (saved) {
      setFirebaseConfigs(JSON.parse(saved));
    }
  }, []);

  // Save configs to localStorage whenever configs change
  useEffect(() => {
    localStorage.setItem("firebase-configs", JSON.stringify(firebaseConfigs));
  }, [firebaseConfigs]);

  const addFirebaseConfig = () => {
    try {
      const config = JSON.parse(newConfigData);
      const newConfig: FirebaseConfig = {
        id: Date.now().toString(),
        name: newConfigName,
        config
      };
      setFirebaseConfigs([...firebaseConfigs, newConfig]);
      setNewConfigName("");
      setNewConfigData("");
      setIsDialogOpen(false);
    } catch (error) {
      alert("Invalid JSON format. Please check your Firebase config.");
    }
  };

  const deleteConfig = (id: string) => {
    setFirebaseConfigs(firebaseConfigs.filter(config => config.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Firebase Management Studio</h1>
            <p className="text-muted-foreground">Manage your Firebase projects and data</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Firebase Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Firebase Configuration</DialogTitle>
                <DialogDescription>
                  Paste your Firebase configuration JSON here
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="config-name">Project Name</Label>
                  <Input
                    id="config-name"
                    placeholder="My Firebase Project"
                    value={newConfigName}
                    onChange={(e) => setNewConfigName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="config-data">Firebase Config JSON</Label>
                  <Textarea
                    id="config-data"
                    placeholder={`{
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "projectId": "your-project-id",
  "storageBucket": "your-project.appspot.com",
  "messagingSenderId": "123456789",
  "appId": "your-app-id"
}`}
                    value={newConfigData}
                    onChange={(e) => setNewConfigData(e.target.value)}
                    rows={8}
                  />
                </div>
                <Button 
                  onClick={addFirebaseConfig} 
                  disabled={!newConfigName || !newConfigData}
                  className="w-full"
                >
                  Add Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {firebaseConfigs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Firebase Projects</h3>
              <p className="text-muted-foreground mb-4">
                Add your first Firebase configuration to get started
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Firebase Config
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firebaseConfigs.map((config) => (
              <Card key={config.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {config.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteConfig(config.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Project ID: {config.config.projectId}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">
                      <Database className="mr-2 h-4 w-4" />
                      Manage Data
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      View Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
