import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Calendar, Star } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import goodnightSpacemanImage from "@/assets/GoodnightSpaceman.jpeg";
import teacherChinImage from "@/assets/teacherChin.jpg";
import letterRecognitionImage from "@/assets/recognition.jpg";
import { useI18n } from "@/hooks/use-i18n";
import React, { useEffect, useState } from "react";

const Home = () => {
  const { t } = useI18n();


  type ProgressVideo = {
    id: number;
    title: string;
    duration: string;
    date: string;
    videoUrl: string;
  } | null;
  const [progressVideo, setProgressVideo] = useState<ProgressVideo>(null);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [image, setImage] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  const [pdf, setPdf] = useState<string | null>(null);
  const [loadingPdfs, setLoadingPdfs] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);
      setVideoError(null);
      try {
        const response = await fetch("http://127.0.0.1:5000/get_videos");
        if (!response.ok) throw new Error("Failed to fetch videos");
        const data = await response.json();
        // Only get the video with filename 'Sample Parent Instruction Video.mp4' in 'public/'
        const filtered = (data.video_urls || []).filter((item: any) => {
          const name = item.name || item.file_name || item.path || item.public_url || item.publicURL || item.url || item;
          return (
            typeof name === 'string' &&
            (name.includes('Sample Parent Instruction Video.mp4'))
          );
        });
        const video = filtered.length > 0 ? {
          id: 1,
          title: t('home.progress.sarahMath'),
          duration: "-",
          date: t('common.today'),
          videoUrl: filtered[0].public_url || filtered[0].publicURL || filtered[0].url || filtered[0],
        } : null;
        setProgressVideo(video);
      } catch (err: any) {
        setVideoError(err.message || "Unknown error");
      } finally {
        setLoadingVideos(false);
      }
    };

    const fetchImages = async () => {
      setLoadingImages(true);
      setImageError(null);
      try {
        const response = await fetch("http://127.0.0.1:5000/get_images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImage((data.image_urls && data.image_urls.length > 0) ? data.image_urls[0] : null);
      } catch (err: any) {
        setImageError(err.message || "Unknown error");
      } finally {
        setLoadingImages(false);
      }
    };

    const fetchPdfs = async () => {
      setLoadingPdfs(true);
      setPdfError(null);
      try {
        const response = await fetch("http://127.0.0.1:5000/get_pdfs");
        if (!response.ok) throw new Error("Failed to fetch pdfs");
        const data = await response.json();
        setPdf((data.pdf_urls && data.pdf_urls.length > 0) ? data.pdf_urls[0] : null);
      } catch (err: any) {
        setPdfError(err.message || "Unknown error");
      } finally {
        setLoadingPdfs(false);
      }
    };

    fetchVideos();
    fetchImages();
    fetchPdfs();
    // eslint-disable-next-line
  }, []);

  const learningMaterials = [
    {
      id: 1,
      title: t('home.materials.numbersCounting'),
      type: t('home.materials.video'),
      duration: "15:30",
      difficulty: t('home.materials.beginner'),
      thumbnail: teacherChinImage
    },
    {
      id: 2,
      title: t('home.materials.letterRecognition'),
      type: t('home.materials.pdfDocument'),
      size: "2.4 MB",
      difficulty: t('home.materials.beginner'),
      thumbnail: letterRecognitionImage
    },
    {
      id: 3,
      title: t('home.materials.creativeArts'),
      type: t('home.materials.video'),
      duration: "20:15",
      difficulty: t('home.materials.intermediate'),
      thumbnail: goodnightSpacemanImage
    }
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Hero Progress Graph Section */}
      <div className="relative overflow-hidden rounded-2xl p-2 md:p-4 shadow-lg min-h-[220px] max-h-[340px] flex flex-col items-center justify-center animate-gradient-move">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-pink-200 via-yellow-100 via-60% to-blue-200 animate-gradient-move" style={{backgroundSize:'200% 200%'}}></div>
        </div>
        {/* Animated Twinkling Stars */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(12)].map((_,i)=>(
            <svg key={i} className={`absolute animate-twinkle`} style={{left:`${8+Math.random()*84}%`,top:`${10+Math.random()*70}%`,animationDelay:`${Math.random()*2}s`}} width="18" height="18" viewBox="0 0 20 20"><polygon points="10,1 12,7 19,7 13,11 15,18 10,14 5,18 7,11 1,7 8,7" fill="#fde68a"/></svg>
          ))}
        </div>
        {/* Motivational Message with Bouncy Animation */}
        <div className="z-20 flex flex-col items-center mb-2 w-full mt-4 md:mt-6">
          <h1 className="text-xl md:text-3xl font-extrabold text-pink-600 mb-1 flex items-center gap-1 animate-bounce-slow font-[Comic Sans MS,Comic Sans,cursive] drop-shadow-glow text-center w-full justify-center">
            {t('home.heroProgress.mainTitle')} <span className="text-yellow-400 text-2xl md:text-3xl animate-spin-slow">⭐</span>
          </h1>
          <p className="text-sm md:text-lg text-blue-700/90 max-w-xs md:max-w-md text-center font-semibold animate-bounce-slow2">
            {t('home.heroProgress.subtitle')}
          </p>
        </div>
        {/* SVG Line Chart with Animated Star */}
        <div className="w-full max-w-xs md:max-w-md z-20">
          <svg viewBox="0 0 240 80" className="w-full h-24 md:h-32">
            {/* Axes */}
            <line x1="32" y1="10" x2="32" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
            <line x1="32" y1="70" x2="238" y2="70" stroke="#cbd5e1" strokeWidth="1.5" />
            {/* Progress Line (4 points, playful curve) */}
            <path d="M32,70 Q70,60 110,55 Q170,40 220,20" fill="none" stroke="#f472b6" strokeWidth="3.5" style={{filter:'drop-shadow(0 0 4px #fbbf24)'}} />
            {/* Dots */}
            <circle cx="32" cy="70" r="5" fill="#fbbf24" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="110" cy="55" r="5" fill="#fbbf24" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="170" cy="40" r="5" fill="#fbbf24" stroke="#f472b6" strokeWidth="1.5" />
            <circle cx="220" cy="20" r="5" fill="#fbbf24" stroke="#f472b6" strokeWidth="1.5" />
            {/* Single Star at the End (right and up) */}
            <text x="230" y="14" fontSize="20" fill="#facc15" className="font-bold">⭐</text>
            {/* Labels */}
            <text x="-2" y="79" fontSize="10" fill="#64748b" className="font-bold">{t('home.heroProgress.startLabel')}</text>
          </svg>
        </div>
        {/* Extra Confetti for Fun */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {[...Array(10)].map((_,i)=>(
            <div key={i} className="absolute animate-confetti" style={{left:`${10+Math.random()*80}%`,top:`${10+Math.random()*80}%`,animationDelay:`${Math.random()*2}s`,width:'10px',height:'10px',backgroundColor:['#fbbf24','#f472b6','#60a5fa','#34d399'][i%4],borderRadius:'50%'}}></div>
          ))}
        </div>
        {/* Custom Animations */}
        <style>{`
          @keyframes gradient-move {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
          .animate-gradient-move {animation: gradient-move 8s ease-in-out infinite;}
          @keyframes twinkle {0%,100%{opacity:0.7;}50%{opacity:1;transform:scale(1.2);}}
          .animate-twinkle {animation: twinkle 1.5s infinite;}
          @keyframes bounce-slow {0%,100%{transform:translateY(0);}50%{transform:translateY(-16px);}}
          .animate-bounce-slow {animation: bounce-slow 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55);}
          @keyframes bounce-slow2 {0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
          .animate-bounce-slow2 {animation: bounce-slow2 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55);}
          @keyframes bounce-star {0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-10px) scale(1.2);}}
          .animate-bounce-star {animation: bounce-star 1.8s infinite cubic-bezier(.68,-0.55,.27,1.55);}
          @keyframes spin-slow {100%{transform:rotate(360deg);}}
          .animate-spin-slow {animation: spin-slow 4s linear infinite;}
          @keyframes confetti {0%{transform:translateY(0);}100%{transform:translateY(60px) rotate(360deg);opacity:0;}}
          .animate-confetti {animation: confetti 2.5s infinite;}
          .drop-shadow-glow {filter: drop-shadow(0 0 8px #fbbf24);}
        `}</style>
      </div>

      {/* Child's Progress Videos */}
      <section className="space-y-6 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('home.progress.title')}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t('home.progress.subtitle')}
            </p>
          </div>
          {/* <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Star className="h-3 w-3 mr-1" />
            {t('home.progress.greatProgress')}
          </Badge> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingVideos ? (
            <div className="col-span-full text-center py-8 text-blue-500 font-semibold">Loading videos...</div>
          ) : videoError ? (
            <div className="col-span-full text-center py-8 text-red-500 font-semibold">{videoError}</div>
          ) : !progressVideo ? (
            <div className="col-span-full text-center py-8 text-gray-500 font-semibold">No videos found.</div>
          ) : (
            <Card key={progressVideo.id} className="group hover:shadow-hover transition-all duration-300 cursor-pointer">
              <div className="relative">
                <video width="750" height="500" controls poster="./screenshot.png">
                  <source src={progressVideo.videoUrl} type="video/mp4"/>
                </video>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{progressVideo.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {progressVideo.date}
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      {/* Learning Materials */}
      <section className="space-y-6 mt-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('home.materials.title')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t('home.materials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningMaterials.map((material) => (
            <Card key={material.id} className="group hover:shadow-hover transition-all duration-300">
              <div className="relative">
                <img 
                  src={material.thumbnail} 
                  alt={material.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <Badge 
                  className={`absolute top-3 left-3 ${
                    material.difficulty === t('home.materials.beginner') ? 'bg-success' : 'bg-accent'
                  }`}
                >
                  {material.difficulty}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{material.title}</CardTitle>
                <CardDescription>
                  {material.type} • {material.duration || material.size}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className="w-full"
                  variant={material.type === t('home.materials.pdfDocument') ? "outline" : "default"}
                >
                  {material.type === t('home.materials.pdfDocument') ? (
                    <>
                      <a href="./Study Material.pdf" download className="flex items-center">
                       <Download className="h-4 w-4 mr-2" />
                       {t('home.materials.download')}
                     </a>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      {t('home.materials.watchNow')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;