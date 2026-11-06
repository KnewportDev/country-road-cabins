"use client";

import { useEffect, useRef, useState } from "react";

type Stay = {
  id: string;
  name: string;
  category: string;
  label: string;
  guests: number;
  image: string;
  alt: string;
  description: string;
  amenities: string[];
  url: string;
};
const BOOKING = "https://guest.rezstream.com/search/country-road-cabins";
const tabs = [
  ["all", "All stays"],
  ["cabins", "Cabins"],
  ["treehouses", "Treehouses"],
  ["yurts", "Yurts"],
  ["glamping", "Glamping"],
];
const gallery = [
  {
    src: "hero-treehouse.webp",
    label: "Tuscany Treehouse · a place in the canopy",
  },
  {
    src: "holly-full.webp",
    label: "Holly Rock · a treehouse around a living oak",
  },
  {
    src: "valley-view.webp",
    label: "Valley View · a classic West Virginia cabin",
  },
  { src: "safari-sun.webp", label: "Safari Sun · a little closer to nature" },
  { src: "hot-tub.webp", label: "Tropical Sun · your private place to unwind" },
  { src: "porch-swing.webp", label: "Laurel · slow mornings on the porch" },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      className="arrow"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h15m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

function TreeMark() {
  return (
    <svg
      className="tree-mark"
      aria-hidden="true"
      viewBox="0 0 56 60"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="M27 3 14 21h7L10 36h10L7 50h17v8h6v-8h17L34 36h10L32 21h8L27 3Z" />
      <path d="M42 16 48 26h-4l8 12h-7m-37-8L3 39h7M27 15v35" />
    </svg>
  );
}

function Brand() {
  return (
    <span className="brand-lockup">
      <TreeMark />
      <span className="brand-words">
        <span>Country Road</span>
        <small>C A B I N S</small>
      </span>
    </span>
  );
}

export default function Homepage({
  initialStays,
  mode = "server",
  assetPrefix = "",
}: {
  initialStays: Stay[];
  mode?: "server" | "snapshot";
  assetPrefix?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [guests, setGuests] = useState("0");
  const [items, setItems] = useState(initialStays);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [modal, setModal] = useState<"stay" | "gallery" | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!modal || !dialog.current) return;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modal]);

  function closeModal() {
    dialog.current?.close();
    setModal(null);
  }

  async function filterStays(nextCategory: string, nextGuests = guests) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setCategory(nextCategory);
    setGuests(nextGuests);
    setExpanded(true);
    setLoading(true);
    setError("");
    if (mode === "snapshot") {
      setItems(
        initialStays.filter(
          (stay) =>
            (nextCategory === "all" || stay.category === nextCategory) &&
            stay.guests >= Number(nextGuests),
        ),
      );
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `/api/stays?category=${encodeURIComponent(nextCategory)}&guests=${encodeURIComponent(nextGuests)}`,
        { signal: controller.signal },
      );
      if (!response.ok) throw new Error("Could not load stays");
      const data = (await response.json()) as { stays: Stay[] };
      setItems(data.stays);
    } catch {
      if (controller.signal.aborted) return;
      setItems(
        initialStays.filter(
          (stay) =>
            (nextCategory === "all" || stay.category === nextCategory) &&
            stay.guests >= Number(nextGuests),
        ),
      );
      setError(
        "Showing our saved collection. Check current availability with Country Road Cabins.",
      );
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  const visibleStays = expanded ? items : items.slice(0, 3);
  const external = { target: "_blank", rel: "noreferrer" };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#" className="brand" aria-label="Country Road Cabins home">
          <Brand />
        </a>
        <nav
          className={menuOpen ? "main-nav open" : "main-nav"}
          aria-label="Main navigation"
        >
          <a href="#stays" onClick={() => setMenuOpen(false)}>
            Our stays
          </a>
          <a href="#experience" onClick={() => setMenuOpen(false)}>
            The experience
          </a>
          <a href="#explore" onClick={() => setMenuOpen(false)}>
            Explore the Gorge
          </a>
          <a href="#visit" onClick={() => setMenuOpen(false)}>
            Find us
          </a>
        </nav>
        <a className="button header-book" href={BOOKING} {...external}>
          Check availability <Arrow diagonal />
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img
            className="hero-photo"
            src={`${assetPrefix}/assets/hero-treehouse.webp`}
            alt="Tuscany Treehouse tucked into the green canopy at Country Road Cabins"
            fetchPriority="high"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow light">
              <span className="small-line" /> Hico, West Virginia · New River
              Gorge
            </p>
            <h1 id="hero-title">
              A little closer
              <br />
              to <em>the wild.</em>
            </h1>
            <p className="hero-copy">
              A cabin in the woods. A porch with nowhere to be.
              <br className="desktop-break" /> Find your own corner of West
              Virginia.
            </p>
            <a className="button cream" href="#stays">
              Find your kind of stay <Arrow />
            </a>
          </div>
          <div className="hero-bottom">
            <span>Quiet mornings. Wide-open possibilities.</span>
            <button
              className="photo-button"
              onClick={() => {
                setGalleryIndex(0);
                setModal("gallery");
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
              >
                <rect x="2" y="2" width="16" height="16" rx="1" />
                <path d="m3 15 5-5 4 4 3-3 3 3" />
                <circle cx="13" cy="6" r="1.5" />
              </svg>{" "}
              A look around <span>01 / 06</span>
            </button>
          </div>
          <span className="hero-side">
            TUSCANY TREEHOUSE / COUNTRY ROAD CABINS
          </span>
        </section>

        <section className="welcome-strip" aria-label="Welcome">
          <p>
            Come for the Gorge.
            <br />
            <em>Stay for the feeling.</em>
          </p>
          <span className="strip-divider" />
          <span>
            Family owned.
            <br />
            West Virginia, through and through.
          </span>
          <span className="strip-divider" />
          <a
            href="https://wvliving.com/best-of-west-virginia-2024-travel/"
            {...external}
            className="award"
          >
            <span className="award-seal" aria-hidden="true">
              ✧
            </span>
            <span>
              <strong>Best of West Virginia</strong>
              <small>2024 GOLD · VACATION RENTAL</small>
            </span>
            <Arrow diagonal />
          </a>
        </section>

        <section id="stays" className="stays-section section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / Make yourself at home</p>
              <h2>
                Somewhere you'll
                <br />
                want to <em>stay awhile.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                Log cabins, treetop hideaways, and a softer side of camping.
                Find the place that feels like you.
              </p>
              <a
                className="text-link"
                href="https://wvcabins.com/cabins/"
                {...external}
              >
                Explore all 27 stays <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="stay-controls">
            <div
              className="category-tabs"
              role="group"
              aria-label="Filter stays by type"
            >
              {tabs.map(([id, label]) => (
                <button
                  key={id}
                  aria-pressed={category === id}
                  className={category === id ? "active" : ""}
                  onClick={() => filterStays(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="guest-filter">
              Room for{" "}
              <select
                value={guests}
                onChange={(e) => filterStays(category, e.target.value)}
                aria-label="Number of guests"
              >
                <option value="0">Everyone</option>
                <option value="2">2 guests</option>
                <option value="4">4 guests</option>
                <option value="6">6 guests</option>
                <option value="8">8+ guests</option>
              </select>
              <span aria-hidden="true">⌄</span>
            </label>
          </div>
          <div className="sr-only" role="status">
            {loading
              ? "Finding your stays"
              : `${items.length} featured stays match your selection`}
          </div>
          {error && (
            <p className="filter-message" role="status">
              {error}
            </p>
          )}
          <div
            className={`stay-grid ${loading ? "loading" : ""}`}
            aria-busy={loading}
          >
            {visibleStays.map((stay, index) => (
              <article className="stay-card" key={stay.id}>
                <button
                  className="stay-photo"
                  onClick={() => {
                    setSelectedStay(stay);
                    setModal("stay");
                  }}
                  aria-label={`Explore ${stay.name}`}
                >
                  <img
                    src={`${assetPrefix}/assets/${stay.image}`}
                    alt={stay.alt}
                    loading="lazy"
                  />
                  <span className="stay-number">0{index + 1}</span>
                  <span className="round-arrow">
                    <Arrow diagonal />
                  </span>
                </button>
                <div className="stay-meta">
                  <span>{stay.label}</span>
                  <span>Up to {stay.guests} guests</span>
                </div>
                <h3>
                  <button
                    onClick={() => {
                      setSelectedStay(stay);
                      setModal("stay");
                    }}
                  >
                    {stay.name}
                  </button>
                </h3>
                <p>{stay.description}</p>
              </article>
            ))}
          </div>
          {items.length === 0 && (
            <div className="empty-stays">
              <h3>A little more room for your crew.</h3>
              <p>
                Our featured selection is only the beginning. Explore the full
                collection for larger cabins and more combinations.
              </p>
              <a
                className="button"
                href="https://wvcabins.com/cabins/"
                {...external}
              >
                See the full collection <Arrow diagonal />
              </a>
            </div>
          )}
          {!expanded && (
            <div className="more-stays">
              <span>A few favorites to get you started.</span>
              <button className="text-link" onClick={() => setExpanded(true)}>
                See more hideaways <span>+</span>
              </button>
            </div>
          )}
        </section>

        <section id="experience" className="experience-section">
          <div className="experience-image">
            <img
              src={`${assetPrefix}/assets/forest.webp`}
              alt="A shaded cabin porch behind blooming rhododendrons"
              loading="lazy"
            />
            <span className="image-note">
              The best plans leave a little room for nothing.
            </span>
          </div>
          <div className="experience-copy">
            <p className="eyebrow">02 / The slower side of life</p>
            <h2>
              Less on the agenda.
              <br />
              <em>More on the porch.</em>
            </h2>
            <p>
              Trade the everyday rush for coffee in the trees, an unhurried
              dinner, and one more soak before bed. Our family-owned retreat
              makes it easy to feel a world away.
            </p>
            <div className="comfort-list">
              <div>
                <span>01</span>
                <p>
                  <strong>Your own place to unwind</strong>Private hot tubs and
                  space to settle in.
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>The comforts that count</strong>Kitchens or
                  kitchenettes, fresh linens, and thoughtful details. Amenities
                  vary by stay.
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>A warm West Virginia welcome</strong>A local team
                  ready to help you make the most of your visit.
                </p>
              </div>
            </div>
            <a
              className="text-link"
              href="https://wvcabins.com/why-us/"
              {...external}
            >
              A little about us <Arrow diagonal />
            </a>
          </div>
        </section>

        <section id="explore" className="explore-section section-pad">
          <div className="section-heading">
            <div>
              <p className="eyebrow light">03 / Outside your door</p>
              <h2>
                Big days.
                <br />
                <em>Slow evenings.</em>
              </h2>
            </div>
            <div className="section-intro">
              <p>
                You're minutes from New River Gorge. Follow the river, find a
                trail, or take the scenic route back.
              </p>
              <a
                className="text-link"
                href="https://wvcabins.com/explore-2/"
                {...external}
              >
                Get to know the area <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="adventure-grid">
            <a
              className="adventure main-adventure"
              href="https://www.nps.gov/neri/index.htm"
              {...external}
            >
              <img
                src={`${assetPrefix}/assets/bridge.webp`}
                alt="Sunlight shining through the New River Gorge Bridge"
                loading="lazy"
              />
              <div>
                <span className="eyebrow light">
                  The view is worth the trip
                </span>
                <h3>New River Gorge</h3>
                <span className="adventure-link">
                  Find your next trail <Arrow diagonal />
                </span>
              </div>
            </a>
            <a
              className="adventure"
              href="https://adventuresonthegorge.com/"
              {...external}
            >
              <img
                src={`${assetPrefix}/assets/gorge.webp`}
                alt="Rafters navigating a whitewater rapid near the New River Gorge"
                loading="lazy"
              />
              <div>
                <span className="eyebrow light">A little adrenaline</span>
                <h3>Follow the river</h3>
                <span className="adventure-link">
                  Explore whitewater rafting <Arrow diagonal />
                </span>
              </div>
            </a>
            <button
              className="adventure"
              onClick={() => {
                setGalleryIndex(5);
                setModal("gallery");
              }}
            >
              <img
                src={`${assetPrefix}/assets/porch-swing.webp`}
                alt="Wooden porch swing beside a log cabin"
                loading="lazy"
              />
              <div>
                <span className="eyebrow light">Or do absolutely nothing</span>
                <h3>Take the slow road</h3>
                <span className="adventure-link">
                  Picture yourself here <Arrow diagonal />
                </span>
              </div>
            </button>
          </div>
        </section>

        <section className="guest-note">
          <p className="eyebrow">Good words travel</p>
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>
            The location was also absolutely perfect as a jumping off point to
            all the hikes we wanted to do.
          </blockquote>
          <p className="quote-credit">
            Jenny W. <span>·</span> April 2026 <span>·</span>{" "}
            <a
              href="https://www.tripadvisor.com/Hotel_Review-g59162-d1732503-Reviews-Country_Road_Cabins-Hico_West_Virginia.html"
              {...external}
            >
              Tripadvisor guest review <Arrow diagonal />
            </a>
          </p>
        </section>

        <section id="visit" className="visit-section section-pad">
          <div className="visit-copy">
            <p className="eyebrow">04 / We'll see you in the woods</p>
            <h2>
              All roads lead
              <br />
              to <em>a good weekend.</em>
            </h2>
            <p>
              Find us in Hico, between Fayetteville and Summersville, with the
              New River Gorge close by.
            </p>
            <address>
              1508 Sunday Road
              <br />
              Hico, West Virginia 25854
            </address>
            <a
              className="text-link"
              href="https://www.google.com/maps/search/?api=1&query=Country+Road+Cabins+1508+Sunday+Road+Hico+WV"
              {...external}
            >
              Get directions <Arrow diagonal />
            </a>
          </div>
          <div className="faq">
            <p className="eyebrow">A few things to know</p>
            <details>
              <summary>
                Can the dog come, too?<span>+</span>
              </summary>
              <p>
                Yes, selected accommodations welcome pets. Check the individual
                listing and confirm the current pet policy before booking.
              </p>
            </details>
            <details>
              <summary>
                Is there a private hot tub?<span>+</span>
              </summary>
              <p>
                Private hot tubs are included with the cabins, yurts, and
                treehouses, and featured glamping tents. Review your selected
                accommodation's amenities before reserving.
              </p>
            </details>
            <details>
              <summary>
                How do I check dates and rates?<span>+</span>
              </summary>
              <p>
                Use “Check availability” to open Country Road Cabins'
                reservation system. That's where you'll find current dates,
                rates, policies, and booking details.
              </p>
            </details>
            <details>
              <summary>
                Can you help me choose a stay?<span>+</span>
              </summary>
              <p>
                Call the local team at{" "}
                <a href="tel:+13046585267">304-658-5267</a> or email{" "}
                <a href="mailto:info@wvcabins.com">info@wvcabins.com</a>.
                They'll help you find a fit for your group.
              </p>
            </details>
          </div>
        </section>

        <section className="closing">
          <div>
            <p className="eyebrow light">
              Your next chapter starts down a country road
            </p>
            <h2>
              Leave a little room
              <br />
              for <em>getting away.</em>
            </h2>
            <a className="button cream" href={BOOKING} {...external}>
              Find your dates <Arrow diagonal />
            </a>
          </div>
          <TreeMark />
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a href="#" className="brand">
            <Brand />
          </a>
          <div>
            <p className="eyebrow">Come say hello</p>
            <a href="tel:+13046585267">304-658-5267</a>
            <a href="mailto:info@wvcabins.com">info@wvcabins.com</a>
          </div>
          <div>
            <p className="eyebrow">Make it a getaway</p>
            <a href="https://wvcabins.com/cabins/" {...external}>
              All accommodations <Arrow diagonal />
            </a>
            <a href="https://wvcabins.com/contact/" {...external}>
              Contact & policies <Arrow diagonal />
            </a>
          </div>
          <span className="footer-place">
            Hico, WV
            <br />
            <em>Almost heaven.</em>
          </span>
        </div>
        <div className="footer-bottom">
          <span>Independent homepage concept · Dylan Cornett</span>
          <span>
            Property photography © its respective owners.{" "}
            <a href="https://wvcabins.com/" {...external}>
              Official website <Arrow diagonal />
            </a>
          </span>
        </div>
      </footer>

      <dialog
        ref={dialog}
        className={`site-dialog ${modal === "gallery" ? "gallery-dialog" : ""}`}
        aria-label={
          modal === "gallery"
            ? "Property photo gallery"
            : selectedStay?.name || "Stay details"
        }
        onCancel={closeModal}
        onClose={() => setModal(null)}
        onClick={(e) => {
          if (e.target === dialog.current) closeModal();
        }}
      >
        <button
          className="dialog-close"
          onClick={closeModal}
          aria-label="Close dialog"
        >
          ×
        </button>
        {modal === "stay" && selectedStay && (
          <div className="stay-detail">
            <img
              src={`${assetPrefix}/assets/${selectedStay.image}`}
              alt={selectedStay.alt}
            />
            <div className="detail-copy">
              <p className="eyebrow">
                {selectedStay.label} · Up to {selectedStay.guests} guests
              </p>
              <h2>{selectedStay.name}</h2>
              <p>{selectedStay.description}</p>
              <ul>
                {selectedStay.amenities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <a className="button" href={selectedStay.url} {...external}>
                View full stay details <Arrow diagonal />
              </a>
              <a className="text-link" href={BOOKING} {...external}>
                Check current dates & rates <Arrow diagonal />
              </a>
              <small>Opens the official Country Road Cabins website.</small>
            </div>
          </div>
        )}
        {modal === "gallery" && (
          <div className="gallery-content">
            <img
              src={`${assetPrefix}/assets/${gallery[galleryIndex].src}`}
              alt={gallery[galleryIndex].label}
            />
            <div className="gallery-caption">
              <p>{gallery[galleryIndex].label}</p>
              <div>
                <button
                  aria-label="Previous photo"
                  onClick={() =>
                    setGalleryIndex(
                      (galleryIndex + gallery.length - 1) % gallery.length,
                    )
                  }
                >
                  ←
                </button>
                <span>{String(galleryIndex + 1).padStart(2, "0")} / 06</span>
                <button
                  aria-label="Next photo"
                  onClick={() =>
                    setGalleryIndex((galleryIndex + 1) % gallery.length)
                  }
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
