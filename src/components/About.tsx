import { MapPin, Users, GraduationCap, Calendar, Mountain, Compass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

interface AboutProps {
  village: any;
}

const About = ({ village }: AboutProps) => {
  const { t } = useTranslation();

  // Return null if village data is not ready
  if (!village) return null;

  const geographyStats = [
    {
      icon: MapPin,
      label: t('common.coordinates'),
      value: `${village.geography?.latitude ?? '-'}°N, ${village.geography?.longitude ?? '-'}°E`,
    },
    {
      icon: Mountain,
      label: t('common.altitude'),
      value: village.geography?.altitude ?? '-',
    },
    {
      icon: Compass,
      label: t('common.area'),
      value: village.area ?? '-',
    },
  ];

  const demographics = [
    {
      icon: Users,
      label: t('common.totalPopulation'),
      value: village.population?.total?.toLocaleString() ?? '-',
      color: "bg-primary",
    },
    {
      icon: Users,
      label: t('common.malePopulation'),
      value: village.population?.male?.toLocaleString() ?? '-',
      color: "bg-accent",
    },
    {
      icon: Users,
      label: t('common.femalePopulation'),
      value: village.population?.female?.toLocaleString() ?? '-',
      color: "bg-success",
    },
    {
      icon: GraduationCap,
      label: t('common.literacyRate'),
      value: village.population?.literacy ?? '-',
      color: "bg-warning",
    },
  ];

  return (
    <section id="about" className="py-10 sm:py-14 md:py-16 lg:py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gradient">
            {t('about.title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            {t('about.description')}
          </p>
        </div>

        {/* Village Map Section */}
        <Card id="map" className="card-elegant animate-fade-in mb-10">
   
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 mt-6 mb-6 sm:mb-12 md:mb-16">
              {/* Village Information */}
              <div className="space-y-8 animate-slide-up">
                <Card className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <MapPin className="h-6 w-6 text-primary" />
                      {t('about.location')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4">
                      {geographyStats.map((stat) => (
                        <div key={stat.label} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover-lift transition-all duration-300 animate-fade-in">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                            <stat.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold">{stat.label}</p>
                            <p className="text-muted-foreground">{stat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border-l-4 border-primary animate-slide-up">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{t('common.administrativeDetails')}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                        <div>
                          <span className="font-medium">{t('common.district')}:</span> {village.district ?? '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('common.state')}:</span> {village.state ?? '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('common.pinCode')}:</span> {village.pincode ?? '-'}
                        </div>
                        <div>
                          <span className="font-medium">{t('about.established')}:</span> {village.established ?? '-'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Demographics */}
              <div className="space-y-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <Card className="card-elegant">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <Users className="h-6 w-6 text-primary" />
                      {t('about.population')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      {demographics.map((stat, index) => (
                        <div 
                          key={stat.label} 
                          className="text-center p-2 sm:p-3 md:p-4 rounded-lg hover-lift transition-all duration-300 animate-fade-in"
                          style={{ 
                            animationDelay: `${(index + 1) * 100}ms`,
                            background: `hsl(var(--muted) / 0.5)` 
                          }}
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.color} text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 transition-transform duration-300 hover:scale-110`}>
                            <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                          </div>
                          <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
                            {stat.value}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 rounded-lg bg-success/5 border border-success/20 animate-slide-up">
                      <p className="text-success font-semibold text-center mb-2">
                        {t('common.genderRatio')}: {village.population?.male ? Math.round((village.population.female / village.population.male) * 1000) : '-'} {t('common.femalesPerMales')}
                      </p>
                      <p className="text-sm text-muted-foreground text-center">
                        {t('common.progressiveValues')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

   
{/* Culture & Traditions Section */}
{/* Culture & Traditions Section
<Card id="culture" className="card-elegant animate-fade-in mt-10">
  <CardHeader>
    <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl md:text-3xl font-semibold">
      <Calendar className="h-6 w-6 text-primary" />
      {t('about.culture', 'संस्कृती आणि परंपरा')}
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">

    {/* Description 
    <p className="text-muted-foreground leading-relaxed text-lg sm:text-lg md:text-xl">
      {village?.cultureDescription ||
        "Our village celebrates rich cultural traditions that have been passed down through generations, fostering community unity and preserving our heritage."}
    </p>

    {/* Cultural Highlights 
    {(village?.culturalHighlights?.length || 0) > 0 ? (
      <div>
        <h3 className="text-xl font-semibold mb-2">Cultural Highlights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {village.culturalHighlights.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center hover-lift transition-transform duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-primary mb-2 text-2xl">{item.icon || "🎉"}</div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p className="text-muted-foreground italic">No cultural highlights available.</p>
    )}

    {/* Festivals & Events 
    {(village?.culture?.length || 0) > 0 ? (
      <div>
        <h3 className="text-xl font-semibold mb-2">Festivals & Events</h3>
        {village.culture.map((c, i) => (
          <div key={i} className="mb-4">
            <h4 className="font-semibold text-lg mb-2">{c.name}</h4>
            <div className="flex flex-wrap gap-3">
              {(c.festivals || []).map((festival, j) => (
                <Badge
                  key={`${i}-${j}`}
                  variant="secondary"
                  className="px-4 py-2 text-sm font-medium hover-lift animate-fade-in transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${j * 100}ms` }}
                >
                  {festival}
                </Badge>
              ))}
              {(c.festivals || []).length === 0 && (
                <p className="text-muted-foreground italic">No festivals listed.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground italic">No cultural events available.</p>
    )}

    {/* Culture Quote *
    {village?.cultureQuote && (
      <div className="mt-6 p-4 sm:p-6 rounded-lg bg-accent/5 border border-accent/20 text-center">
        <p className="text-accent-foreground italic text-lg sm:text-xl md:text-xl">
          "{village.cultureQuote}"
        </p>
      </div>
    )}
 
  </CardContent>
</Card>

 */}


      </div>
    </section>
  );
};

export default memo(About);
