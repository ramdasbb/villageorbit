import { useContext, useEffect } from "react";
import { VillageContext } from "@/context/VillageContextConfig";
import Panchayat from "@/components/Panchayat";
import GovStaff from "@/components/GovStaff";
import SectionSkeleton from "@/components/ui/skeletons/SectionSkeleton";
import { useLocation } from "react-router-dom";

const PanchayatPage = () => {
  const { config, loading } = useContext(VillageContext);
  const { hash } = useLocation();

  // Scroll to anchor if hash exists
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  if (loading || !config) return <SectionSkeleton />;

  return (
    <main className="space-y-20">
      {/* Other sections */}
      <Panchayat {...config.panchayat} />

      {/* GovStaff section */}
      <GovStaff govStaff={config.govStaff || []} />
    </main>
  );
};

export default PanchayatPage;
