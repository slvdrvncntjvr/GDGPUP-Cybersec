import React, { useState } from 'react';
import { Camera, Shield, Terminal, Crosshair, ExternalLink, Zap, Lock, Activity, Code } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CommunityHub() {
    const [teamHover, setTeamHover] = useState<'red' | 'blue' | null>(null);

    const studyJams = [
        {
            id: "item-1",
            title: 'SJ 1: Linux Setup and Basic Commands',
            description: 'Study Jam 1 provides a foundational guide to setting up a Kali Linux virtual machine and mastering essential command-line operations through hands-on practice.',
        },
        {
            id: "item-2",
            title: 'SJ 2: Networking & Protocols for Security',
            description: 'Study Jam 2 focuses on fundamental networking concepts, protocol security, and practical network simulation using Cisco Packet Tracer to design and secure departmental network topologies.',
        },
        {
            id: "item-3",
            title: 'SJ 3: Cyber Attack and Port Scanning',
            description: 'Study Jam 3 covers the essential methodologies for reconnaissance and enumeration, teaching participants how to identify target systems, discover open ports, and map out a network\'s attack surface using tools like Nmap and DNS queries.',
        },
        {
            id: "item-4",
            title: 'SJ 4: Web/App Essentials & Burp Suite Operations',
            description: 'Study Jam 4 provides a comprehensive introduction to web application security, covering the HTTP protocol, the OWASP Top 10 critical risks, and the practical use of Burp Suite for intercepting and modifying web traffic.',
        }
    ];

    const steps = [
        { id: 1, title: 'Pick A Team', subtitle: 'Specialize your skillset', icon: <Code className="w-5 h-5 text-primary" /> },
        { id: 2, title: 'Attend Workshops', subtitle: 'Master the fundamentals', icon: <Lock className="w-5 h-5 text-primary" /> },
        { id: 3, title: 'Complete Rooms', subtitle: 'Live vulnerability hunting', icon: <Activity className="w-5 h-5 text-primary" /> },
        { id: 4, title: 'Earn XPs & Ranks', subtitle: 'Climb the leaderboard', icon: <Zap className="w-5 h-5 text-primary" /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-sans transition-colors duration-300 selection:bg-primary/20 relative overflow-hidden">
        
        <div className="relative z-20">
            <Navbar />
        </div>

        <main className="flex-1 p-6 md:p-12 lg:py-16 relative z-10">
            
            <div className="flex flex-col items-center justify-center mb-16 text-center space-y-4 pt-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground drop-shadow-sm">
                    Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[hsl(var(--cyber-blue))]">Hub</span>
                </h1>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            
                <div className="lg:col-span-7 space-y-8">
                    <div className="border-b border-border pb-4 text-center lg:text-left">
                        <h2 className="text-2xl font-bold flex items-center justify-center lg:justify-start gap-2">
                            <Shield className="w-6 h-6 text-[hsl(var(--cyber-blue))]" />
                            Chapters & Meetups
                        </h2>
                        <p className="text-sm text-muted-foreground font-medium tracking-wide uppercase mt-2">
                            Cybersecurity team under GDG PUP
                        </p>
                    </div>

                    <Accordion type="single" collapsible defaultValue="item-1" className="space-y-4 w-full">
                    {studyJams.map((jam) => (
                        <AccordionItem 
                            key={jam.id} 
                            value={jam.id} 
                            className="border rounded-xl bg-card/50 backdrop-blur-sm px-2 border-border shadow-sm hover:shadow-[0_0_20px_hsl(var(--primary)/0.25)] hover:border-primary/50 data-[state=open]:border-primary data-[state=open]:bg-card transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 data-[state=open]:opacity-100 transition-opacity"></div>
                            
                            <AccordionTrigger className="hover:no-underline px-4 py-5 text-sm font-semibold text-card-foreground data-[state=open]:text-primary group">
                                <div className="flex text-left w-full pr-4">
                                    <span>{jam.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-5 space-y-5">
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {jam.description}
                                </p>
                                
                                {/* REPLACE THE DIV BELOW WITH YOUR PHOTO.
                                    Recommended size: 800px width by 400px height (800x400).
                                    
                                    Example:
                                    <img src="/your-image-path.jpg" alt={jam.title} className="w-full h-52 object-cover rounded-lg border border-border/50 shadow-inner" />
                                */}
                                <div className="w-full h-52 rounded-lg border border-border/50 bg-background/50 flex flex-col items-center justify-center shadow-inner group-hover:border-primary/20 relative overflow-hidden transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                                    <Camera className="w-8 h-8 text-muted-foreground/50 mb-3 group-hover:text-primary/70 transition-colors duration-300 z-10" />
                                    <span className="font-mono text-[10px] text-muted-foreground/50 group-hover:text-primary/70 transition-colors duration-300 z-10 tracking-widest uppercase">
                                        [ Awaiting Visual Data ]
                                    </span>
                                </div>

                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>

                    <div className="mt-12 relative flex items-center justify-center py-6">
                        <Separator className="absolute w-full border-dashed border-border" />
                        <div className="relative bg-background px-6 py-2 rounded-full z-10 shadow-sm flex items-center gap-3 border border-border">
                            <span className="w-2 h-2 rounded-full bg-muted-foreground animate-ping absolute -left-1"></span>
                            <span className="text-muted-foreground font-mono text-xs uppercase tracking-wider">Coming Soon:</span>
                            <span className="font-bold text-[hsl(var(--cyber-red))] drop-shadow-[0_0_5px_rgba(255,0,0,0.3)]">RED</span>
                            <span className="text-muted-foreground font-mono text-xs">VS</span>
                            <span className="font-bold text-[hsl(var(--cyber-blue))] drop-shadow-[0_0_5px_rgba(0,100,255,0.3)]">BLUE</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
                    <div className="w-full border-b border-border pb-4 mb-8 text-center lg:text-left">
                        <h2 className="text-2xl font-bold">Execution Path</h2>
                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">
                            Protocol Sequence
                        </p>
                    </div>

                    <div className="relative flex flex-col items-center lg:items-start space-y-6 w-full max-w-sm pl-0 lg:pl-6">
                        
                        <div className="absolute left-[50%] lg:left-[42px] top-[40px] bottom-[40px] w-[2px] bg-gradient-to-b from-primary via-primary to-primary/20 -z-10 opacity-50 transform -translate-x-1/2"></div>

                        {steps.map((step) => (
                            <div key={step.id} className="relative w-full group">
                                
                                <Card className={`w-full relative overflow-hidden transition-all duration-500 hover-elevate bg-card border border-border shadow-sm hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] ${
                                    step.id === 1 && teamHover === 'red' ? '!border-[hsl(var(--cyber-red)/0.6)] !shadow-[0_0_30px_hsl(var(--cyber-red)/0.25)]' :
                                    step.id === 1 && teamHover === 'blue' ? '!border-[hsl(var(--cyber-blue)/0.6)] !shadow-[0_0_30px_hsl(var(--cyber-blue)/0.25)]' : ''
                                }`}>
                                    
                                    {step.id === 1 && teamHover === 'red' && (
                                        <div className="absolute inset-0 bg-[hsl(var(--cyber-red)/0.03)] pointer-events-none transition-colors duration-500"></div>
                                    )}
                                    {step.id === 1 && teamHover === 'blue' && (
                                        <div className="absolute inset-0 bg-[hsl(var(--cyber-blue)/0.03)] pointer-events-none transition-colors duration-500"></div>
                                    )}

                                    <CardHeader className="p-5 flex flex-row items-center gap-4">
                                        <div className={`p-3 rounded-xl flex-shrink-0 transition-colors duration-500 z-10 bg-primary/10 border border-primary/20 ${
                                            step.id === 1 && teamHover === 'red' ? '!bg-[hsl(var(--cyber-red)/0.1)] !border-[hsl(var(--cyber-red)/0.3)]' :
                                            step.id === 1 && teamHover === 'blue' ? '!bg-[hsl(var(--cyber-blue)/0.1)] !border-[hsl(var(--cyber-blue)/0.3)]' : ''
                                        }`}>
                                            {step.id === 1 && teamHover === 'red' ? <Crosshair className="w-5 h-5 text-[hsl(var(--cyber-red))]" /> : 
                                                step.id === 1 && teamHover === 'blue' ? <Shield className="w-5 h-5 text-[hsl(var(--cyber-blue))]" /> :
                                                step.icon}
                                        </div>
                                        
                                        <div>
                                            <CardTitle className="text-base font-bold text-card-foreground">
                                                {step.title}
                                            </CardTitle>
                                            <p className="text-xs font-mono text-muted-foreground mt-1">
                                                {step.subtitle}
                                            </p>
                                        </div>
                                    </CardHeader>
                                    
                                    {step.id === 1 && (
                                        <CardContent className="pt-0 pb-6 w-full flex justify-center">
                                            <div className="flex items-center gap-6 font-display font-bold text-xl tracking-wider">
                                                <span 
                                                    onMouseEnter={() => setTeamHover('red')}
                                                    onMouseLeave={() => setTeamHover(null)}
                                                    className="text-[hsl(var(--cyber-red))] cursor-pointer transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_12px_hsl(var(--cyber-red)/0.6)]"
                                                >
                                                    RED
                                                </span>
                                                <span className="text-muted-foreground font-mono text-sm opacity-50">VS</span>
                                                <span 
                                                    onMouseEnter={() => setTeamHover('blue')}
                                                    onMouseLeave={() => setTeamHover(null)}
                                                    className="text-[hsl(var(--cyber-blue))] cursor-pointer transition-all duration-300 hover:scale-125 hover:drop-shadow-[0_0_12px_hsl(var(--cyber-blue)/0.6)]"
                                                >
                                                    BLUE
                                                </span>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-28 mb-10 flex flex-col items-center justify-center relative w-full">
                
                <Separator className="w-full mb-16 border-border" />

                <div className="absolute inset-0 bg-primary/30 blur-[120px] rounded-full w-3/4 h-3/4 mx-auto -z-10 pointer-events-none mt-16 transition-opacity duration-500"></div>
                
                <Button 
                    size="lg" 
                    className="relative overflow-hidden bg-gradient-to-r from-[hsl(var(--cyber-blue))] to-primary text-primary-foreground hover:scale-[1.03] px-16 py-12 rounded-2xl shadow-[0_0_40px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_60px_hsl(var(--cyber-blue)/0.6)] transition-all duration-300 group border border-white/20 h-auto flex flex-col gap-3"
                >
                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    
                    <span className="text-2xl md:text-3xl font-display font-extrabold tracking-wide flex items-center gap-3 drop-shadow-md">
                        Join The Department <ExternalLink className="w-7 h-7 opacity-90 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                    
                    <div className="bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-white/90 font-medium text-xs font-mono uppercase tracking-widest">
                            Community GC via messenger
                        </span>
                    </div>
                </Button>
            </div>
        </main>

        <div className="relative z-20">
            <Footer />
        </div>

        </div>
    );
}