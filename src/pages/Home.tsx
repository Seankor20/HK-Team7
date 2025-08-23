import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Calendar, Star } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import { useI18n } from "@/hooks/use-i18n";

const Home = () => {
  const { t } = useI18n();

  const progressVideos = [
    {
      id: 1,
      title: t('home.progress.sarahMath'),
      duration: "2:30",
      date: t('common.today'),
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: t('home.progress.readingAchievement'),
      duration: "1:45",
      date: t('common.yesterday'),
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    }
  ];

  const learningMaterials = [
    {
      id: 1,
      title: t('home.materials.numbersCounting'),
      type: t('home.materials.video'),
      duration: "15:30",
      difficulty: t('home.materials.beginner'),
      thumbnail: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: t('home.materials.letterRecognition'),
      type: t('home.materials.pdfDocument'),
      size: "2.4 MB",
      difficulty: t('home.materials.beginner'),
      thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: t('home.materials.creativeArts'),
      type: t('home.materials.video'),
      duration: "20:15",
      difficulty: t('home.materials.intermediate'),
      thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop"
    }
  ];

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 md:p-12">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t('home.hero.welcomeBack')} 👋
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-6 max-w-2xl">
            {t('home.hero.description')}
          </p>
          <Button size="lg" variant="secondary" className="shadow-hover">
            {t('home.hero.continueLearning')}
          </Button>
        </div>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20">
          <img 
            src={heroImage} 
            alt={t('home.hero.imageAlt')}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Child's Progress Videos */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('home.progress.title')}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t('home.progress.subtitle')}
            </p>
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <Star className="h-3 w-3 mr-1" />
            {t('home.progress.greatProgress')}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-hover transition-all duration-300 cursor-pointer">
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-t-lg" />
                <Button 
                  size="sm" 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/90 hover:bg-primary shadow-glow"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Badge className="absolute top-3 right-3 bg-background/90 text-foreground">
                  {video.duration}
                </Badge>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{video.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {video.date}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning Materials */}
      <section className="space-y-6">
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
                      <Download className="h-4 w-4 mr-2" />
                      {t('common.download')}
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