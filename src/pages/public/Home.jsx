import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listCategories } from "../../services/categories.service";
import { listFeatured } from "../../services/products.service";

import Hero from "../../components/home/Hero";
import CategoryGrid from "../../components/home/CategoryGrid";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import WhyUs from "../../components/home/WhyUs";
import Testimonials from "../../components/home/Testimonials";
import FooterCTA from "../../components/home/FooterCTA";

import "../../components/home/home.css";

export default function Home() {
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [featured, setFeatured] = useState([]);
  const heroImg = "/sample.png";

  useEffect(() => {
    (async () => {
      const c = await listCategories();
      setCats(c);

      const f = await listFeatured(6);
      setFeatured(f);
    })();
  }, []);

  return (
    <div className="bgx">
      <Hero heroImg={heroImg} />

      <div className="container">
        <div className="divider" />
      </div>

      <CategoryGrid cats={cats} onOpenCategory={(id) => nav(`/category/${id}`)} />

      <div className="container">
        <div className="divider" />
      </div>

      <FeaturedProducts featured={featured} onGoCart={() => nav("/cart")} />

      <div className="container">
        <div className="divider" />
      </div>

      <WhyUs />

      <div className="container">
        <div className="divider" />
      </div>

      <Testimonials />

      <FooterCTA
        onExplore={() =>
          document.getElementById("collections")?.scrollIntoView({ behavior: "smooth" })
        }
        onFeatured={() =>
          document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
        }
      />
    </div>
  );
}
