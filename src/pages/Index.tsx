import React, { useContext, lazy, Suspense, useMemo, memo } from "react";
import Hero from "@/components/Hero";
import { VillageContext } from "@/context/VillageContextConfig";
import { usePageSEO } from "@/hooks/usePageSEO";
import HeroSkeleton from "@/components/ui/skeletons/HeroSkeleton";
import SectionSkeleton from "@/components/ui/skeletons/SectionSkeleton";
import GallerySkeleton from "@/components/ui/skeletons/GallerySkeleton";
import { VILLAGES } from "@/config/villageConfig";
import LazySection from "@/components/LazySection";
import { useTranslation } from "react-i18next";


/* Lazy-loaded components */
const ScrollerCardSection = lazy(() => import("@/components/ScrollerCardSection"));
const NewsTicker = lazy(() => import("@/components/NewsTicker"));
const About = lazy(() => import("@/components/About"));
const Panchayat = lazy(() => import("@/components/Panchayat"));
const GovStaff = lazy(() => import("@/components/GovStaff"));
const Announcements = lazy(() => import("@/components/Announcements"));
const Schemes = lazy(() => import("@/components/Schemes"));
const Services = lazy(() => import("@/components/Services"));
const Development = lazy(() => import("@/components/Development"));
const Gallery = lazy(() => import("@/components/Gallery"));
const Contact = lazy(() => import("@/components/Contact"));
const PeopleSection = lazy(() => import("@/components/PeopleSection"));
const { t } = useTranslation();

const Index: React.FC = () => {
  const { config, isPageVisible, loading } = useContext(VillageContext);
  // 🧠 SEO setup
  usePageSEO({
    title: `${VILLAGES.shivankhed.name} Gram Panchayat | Official Website`,
    description: `Official website of ${VILLAGES.shivankhed.name} Gram Panchayat. Access government schemes, development projects, announcements, services, and contact information.`,
    keywords: [
      "gram panchayat",
      "village website",
      "government schemes",
      "development projects",
      "village services",
      VILLAGES.shivankhed.name,
    ],
    canonical: "https://shivankhedkhurd.vercel.app",
  });

  const memoizedConfig = useMemo(() => config, [config]);

  if (loading || !memoizedConfig) return <HeroSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Hero Section */}
        <Suspense fallback={<HeroSkeleton />}>
          <Hero
            village={memoizedConfig.village}
            panchayat={memoizedConfig.panchayat}
          />
        </Suspense>

        {/* Scroller Card Section */}
        {memoizedConfig.scrollerCards?.length > 0 && (
          <Suspense fallback={null}>
            <ScrollerCardSection cards={memoizedConfig.scrollerCards} />
          </Suspense>
        )}

        {/* News Ticker */}
        {memoizedConfig.newsTicker?.length > 0 && (
          <Suspense fallback={null}>
            <NewsTicker news={memoizedConfig.newsTicker} />
          </Suspense>
        )}

        {/* Announcements */}
        {isPageVisible("announcement") && (
          <LazySection
            component={Announcements}
            fallback={<SectionSkeleton />}
            props={{ announcements: memoizedConfig.announcements }}
          />
        )}

        {/* About */}
        {isPageVisible("about") && (
          <LazySection
            component={About}
            fallback={<SectionSkeleton />}
            props={{ village: memoizedConfig.village }}
          />
        )}

        {/* Panchayat */}
        {isPageVisible("panchayat") && (
          <LazySection
            component={Panchayat}
            fallback={<SectionSkeleton />}
            props={{ panchayat: memoizedConfig.panchayat }}
          />
        )}

        {/* Government Staff */}
        {memoizedConfig.govStaff?.length > 0 && (
          <LazySection
            component={GovStaff}
            fallback={<SectionSkeleton />}
            props={{ govStaff: memoizedConfig.govStaff }}
          />
        )}

        {/* Schemes */}
        {isPageVisible("schemes") && (
          <LazySection
            component={Schemes}
            fallback={<SectionSkeleton />}
            props={{ schemes: memoizedConfig.schemes }}
          />
        )}

        {/* Services */}
        {isPageVisible("services") && (
          <LazySection
            component={Services}
            fallback={<SectionSkeleton />}
            props={{ services: memoizedConfig.services }}
          />
        )}

        {/* Development */}
        {isPageVisible("development") && (
          <LazySection
            component={Development}
            fallback={<SectionSkeleton />}
            props={{ developmentWorks: memoizedConfig.developmentWorks }}
          />
        )}

        {/* Proud of Our People */}
    <LazySection
  component={PeopleSection}
  fallback={<SectionSkeleton />}
  props={{
    title: t("proudPeople.title"),
    description: t("proudPeople.description"),
    people: memoizedConfig.proudPeople,
    sectionId: "proud-people",
  }}
/>


        {/* Asha Workers */}
        {memoizedConfig.ashaWorkers?.length > 0 && (
          <LazySection
            component={PeopleSection}
            fallback={<SectionSkeleton />}
            props={{
              title: "Asha Workers",
              description: "Dedicated health workers serving our community with care and compassion",
              people: memoizedConfig.ashaWorkers,
              sectionId: "asha-workers"
            }}
          />
        )}

        {/* Anganwadi Karykarti */}
        {memoizedConfig.anganwadiWorkers?.length > 0 && (
          <LazySection
            component={PeopleSection}
            fallback={<SectionSkeleton />}
            props={{
              title: "Anganwadi Karykarti",
              description: "Committed workers ensuring child development and women welfare in our village",
              people: memoizedConfig.anganwadiWorkers,
              sectionId: "anganwadi-workers"
            }}
          />
        )}

        {/* Gallery */}
        {isPageVisible("gallery") && (
          <LazySection
            component={Gallery}
            fallback={<GallerySkeleton />}
            props={{ gallery: memoizedConfig.gallery }}
          />
        )}

        {/* Contact */}
        {isPageVisible("contact") && (
          <LazySection
            component={Contact}
            fallback={<SectionSkeleton />}
            props={{
              contact: memoizedConfig.contact,
              documents: memoizedConfig.documents,
            }}
          />
        )}
      </main>
    </div>
  );
};

export default memo(Index);
