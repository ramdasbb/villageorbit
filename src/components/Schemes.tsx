import { useState } from 'react';
import { IndianRupee, FileText, Users, Phone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from 'react-i18next';
import DocumentsModal from './DocumentsModal';

interface SchemesProps {
  schemes: any[];
}

const Schemes = ({ schemes }: SchemesProps) => {
  const { t } = useTranslation();
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<{ name: string; documents: string[] } | null>(null);

  const handleApplyClick = (scheme: any) => {
    setSelectedScheme({
      name: scheme.name,
      documents: scheme.documents || []
    });
    setIsDocsModalOpen(true);
  };

  const getSchemeIcon = (schemeName: string) => {
    if (schemeName.includes("Kisan")) return "🌾";
    if (schemeName.includes("Ayushman")) return "🏥";
    if (schemeName.includes("Swachh")) return "🚽";
    if (schemeName.includes("MGNREGA")) return "🏗️";
    return "📋";
  };

  const getSchemeColor = (index: number) => {
    const colors = ["bg-primary", "bg-success", "bg-accent", "bg-warning"];
    return colors[index % colors.length];
  };

  return (
    <section id="schemes" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
    <div className="text-center mb-16 animate-fade-in">
  <h2 className="text-4xl font-bold mb-4 text-gradient">
    {t("schemes.title")}
  </h2>
  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
    {t("schemes.description")}
  </p>
</div>


        {/* Schemes Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {schemes.map((scheme, index) => (
            <Card 
              key={scheme.name} 
              className="card-elegant hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${getSchemeColor(index)} text-white rounded-lg flex items-center justify-center text-2xl`}>
                      {getSchemeIcon(scheme.name)}
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{scheme.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        Government Scheme
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {scheme.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Benefits */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-success" />
                    Benefits
                  </h4>
                  <div className="bg-success/5 rounded-lg border border-success/20">
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Eligibility
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                    {scheme.eligibility}
                  </p>
                </div>

                <Separator />

                {/* Application Process */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    How to Apply
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {scheme.application}
                  </p>
                  
                  {/* Required Documents */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Required Documents:</p>
                    <div className="flex flex-wrap gap-2">
                      {scheme.documents.map((doc, docIndex) => (
                        <Badge 
                          key={docIndex} 
                          variant="outline" 
                          className="text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => handleApplyClick(scheme)}
                  >
                    Apply Now
                  </Button>
                  {/* <Button variant="outline" size="sm">
                    Learn More
                  </Button> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        {/* <Card className="card-elegant animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Phone className="h-6 w-6 text-primary" />
              Need Help with Applications?
            </CardTitle>
          </CardHeader>
              <CardContent className="text-center space-y-6">
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('schemes.helpDescription')}
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover-lift transition-all duration-300 animate-fade-in">
                <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">{t('schemes.phoneSupport')}</p>
                <p className="text-xs text-muted-foreground">+91 20 2567 8901</p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 hover-lift transition-all duration-300 animate-fade-in" style={{ animationDelay: "100ms" }}>
                <Users className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">{t('schemes.inPersonHelp')}</p>
                <p className="text-xs text-muted-foreground">{t('contact.office')}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 hover-lift transition-all duration-300 animate-fade-in" style={{ animationDelay: "200ms" }}>
                <FileText className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="text-sm font-medium">{t('schemes.documentHelp')}</p>
                <p className="text-xs text-muted-foreground">{t('schemes.freeVerification')}</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        <DocumentsModal 
          isOpen={isDocsModalOpen}
          onClose={() => setIsDocsModalOpen(false)}
          serviceName={selectedScheme?.name || ''}
          documents={selectedScheme?.documents || []}
        />
      </div>
    </section>
  );
};

export default Schemes;