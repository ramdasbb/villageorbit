import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Phone, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MemberPopupModal from './MemberPopupModal';

const GovStaff = ({ govStaff }) => {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!govStaff || govStaff.length === 0) return null;

  const handleMemberClick = (member) => {
    setSelectedMember({
      name: member.name,
      image: member.photo,
      role: member.role,
      description: member.work,
      contact: member.contact,
      email: member.email,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="gov-staff" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">

          {/* 🚀 Now controlled by i18n */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              {t("govstaff.title")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("govstaff.description")}
            </p>
          </div>

          {/* Staff Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {govStaff.map((staff, index) => (
              <Card 
                key={staff.name}
                className="card-elegant hover-lift animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleMemberClick(staff)}
              >
                <CardHeader className="text-center">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-2 border-accent cursor-pointer hover:border-primary transition-colors">
                    <img 
                      src={staff.photo} 
                      alt={staff.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-lg">{staff.name}</CardTitle>
                  <Badge variant="outline" className="mx-auto text-xs">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {staff.role}
                  </Badge>
                </CardHeader>

                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {staff.work}
                  </p>

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${staff.contact}`;
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {staff.contact}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <MemberPopupModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={selectedMember}
      />
    </>
  );
};

export default GovStaff;
