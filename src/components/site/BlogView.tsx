"use client";

import { useState } from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogViewProps {
  onNavigate: (view: any) => void;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  keywords: string[];
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-prepare-dtf-artwork-for-printing-in-kenya",
    title: "How to Prepare DTF Artwork for Printing in Kenya",
    excerpt:
      "Step-by-step guide to preparing your designs for DTF (Direct-to-Film) printing. Learn file formats, resolution, color modes, and gang sheet building tips used by professional printers in Nairobi and across Kenya.",
    category: "DTF Printing",
    date: "2026-06-24",
    readTime: "8 min read",
    keywords: ["DTF printing Kenya", "prepare DTF artwork", "DTF file format", "gang sheet Kenya"],
    content: [
      "Preparing artwork for DTF (Direct-to-Film) printing is the most critical step in getting professional-quality transfers. Whether you are printing custom T-shirts in Nairobi or running a print shop in Kiambu, the quality of your final product depends entirely on how well you prepare your design file before it hits the printer. In this guide, we walk through every step of the process, from choosing the right file format to building efficient gang sheets that minimize waste and maximize profit.",
      "DTF printing works by printing your design onto a special PET film, then transferring it to fabric using heat and pressure. Unlike traditional screen printing, DTF does not require color separation or screens, which makes it ideal for full-color designs, photographs, and complex graphics. However, the quality of the transfer depends on the resolution and format of your source file. A low-resolution image will produce a blurry, pixelated print that no amount of heat press magic can fix.",
      "The first step is choosing the right file format. PNG with transparent background is the gold standard for DTF artwork. The transparency ensures that only your design gets printed, not a white rectangle around it. If your image has a background, you need to remove it first. You can use our free Image Clipper tool, which runs entirely in your browser using AI to detect and remove backgrounds with precision. JPEG files can work but they do not support transparency, so you will end up with a white background on your transfer. SVG files are excellent for logos and vector graphics because they scale without quality loss.",
      "Resolution is equally important. DTF printers typically print at 300 DPI (dots per inch), which is the standard for professional print quality. If your image is 150 DPI, the printer will still print it, but the result will look soft and blurry, especially on close inspection. To check your image resolution, open it in any image editor and look at the pixel dimensions. For a 12-inch wide design, you need at least 3600 pixels wide (12 x 300 = 3600). If your image is smaller, you can upscale it using our free Image Upscaler tool, which uses AI to add detail and sharpness during upscaling.",
      "Color mode is another factor that affects print quality. DTF printers use CMYK ink, but most digital images are in RGB format. The conversion from RGB to CMYK happens automatically in the printer software, but if you want the most accurate color reproduction, you can convert your image to CMYK before sending it to print. Keep in mind that some vibrant RGB colors (especially bright greens and blues) may appear slightly duller in CMYK. For best results, design your artwork in RGB and let the printer handle the conversion, but avoid using extremely saturated colors that fall outside the CMYK gamut.",
      "Building a gang sheet is where you can save significant money on DTF printing. A gang sheet is a single large sheet that contains multiple designs arranged efficiently. Instead of printing each design individually (which wastes film and ink), you arrange multiple designs on a single sheet. Our free Canvas Designer tool lets you build gang sheets up to 22 inches by 120 inches, with drag-and-drop functionality, auto-arrange for efficient nesting, and 300 DPI export. The key to efficient gang sheet building is to leave a small gap (about 0.25 inches) between each design so they can be cut apart easily after printing.",
      "White underbase is a critical step in DTF printing, especially for dark garments. The printer lays down a white ink layer first, then prints your design colors on top. This white layer ensures that your colors appear vibrant and accurate on dark fabrics. If you are printing on a black T-shirt, the white underbase is what makes a bright yellow design actually look yellow instead of dark olive. Our Color Knockout tool can help you generate white underbase layers for your designs, and you can preview how your design will look on different garment colors using our Mockup Generator.",
      "Finally, always test print before committing to a large batch. Print one transfer, apply it to a test garment, and check the results. Look for color accuracy, edge sharpness, and adhesion. If the transfer peels easily after cooling, your heat press temperature or pressure may need adjustment. Most DTF transfers require 160-170 degrees Celsius for 10-15 seconds at medium pressure. Always follow the film manufacturer's specifications for temperature and dwell time, as these can vary between brands.",
    ],
  },
  {
    slug: "dtf-vs-dtg-printing-which-is-better",
    title: "DTF vs DTG Printing: Which is Better for Your Business?",
    excerpt:
      "Direct-to-Film vs Direct-to-Garment printing compared. Cost, quality, durability, fabric compatibility, and which method is best for your T-shirt printing business in Kenya.",
    category: "Printing Guide",
    date: "2026-06-24",
    readTime: "10 min read",
    keywords: ["DTF vs DTG", "DTG printing Kenya", "T-shirt printing methods", "direct to film vs direct to garment"],
    content: [
      "The debate between DTF (Direct-to-Film) and DTG (Direct-to-Garment) printing is one of the most common questions we hear from T-shirt printing businesses in Kenya. Both methods produce high-quality custom apparel, but they differ significantly in cost, quality, durability, and fabric compatibility. In this comprehensive comparison, we break down every aspect to help you choose the right printing method for your specific needs and budget.",
      "DTF printing, or Direct-to-Film printing, works by printing your design onto a special PET film using CMYK inks plus a white ink underbase. The film is then coated with an adhesive powder, cured, and heat-pressed onto the garment. The result is a vibrant, durable transfer that works on virtually any fabric, including cotton, polyester, blends, nylon, and even leather. DTF is the newer technology, having gained massive popularity since 2020 due to its versatility and relatively low equipment cost.",
      "DTG printing, or Direct-to-Garment printing, works by printing ink directly onto the fabric using specialized inkjet technology, similar to how a desktop printer prints on paper. The ink soaks into the fibers of the fabric, creating a soft-hand feel that many people prefer. DTG works best on cotton-rich fabrics (at least 60% cotton) and requires pre-treatment for dark garments. DTG has been around longer than DTF and is the preferred method for high-volume print-on-demand operations like Printful and Printify.",
      "When it comes to print quality, both methods can produce excellent results, but they have different strengths. DTF produces more vibrant colors and sharper edges because the ink sits on top of the fabric rather than soaking in. Fine details and small text reproduce more accurately with DTF. DTG produces a softer feel because the ink integrates with the fabric fibers, but colors may appear slightly less vibrant, especially on dark garments where the white underbase can feel heavy.",
      "Durability is where DTF has a clear advantage. DTF transfers typically last 50-100 washes before showing significant fading or cracking, while DTG prints generally last 30-50 washes. The adhesive in DTF creates a stronger bond with the fabric, making it more resistant to repeated washing and wear. For businesses selling custom T-shirts to customers who expect longevity, DTF is the better choice. For promotional T-shirts that will be worn a few times and discarded, DTG is perfectly adequate.",
      "Cost comparison depends on your volume and setup. DTF equipment is generally less expensive than DTG. A basic DTF printer setup costs between KES 200,000 and KES 800,000, while a DTG printer ranges from KES 500,000 to KES 2,000,000 or more. Per-print costs are also lower with DTF because the film and ink are cheaper than DTG pre-treatment and specialty inks. For small to medium print runs (1-100 shirts), DTF is almost always more cost-effective. For very large runs (500+ shirts of the same design), screen printing remains the most economical option.",
      "Fabric compatibility is where DTF truly shines. DTF works on virtually any fabric: cotton, polyester, nylon, blends, denim, canvas, and even leather. This makes it ideal for businesses that print on a variety of products, not just T-shirts. DTG is limited to cotton-rich fabrics and struggles with polyester and synthetic blends. If you plan to print on performance wear, polyester jerseys, or blended fabrics, DTF is your only viable option between the two.",
      "For businesses in Kenya specifically, DTF offers several advantages. The equipment is more affordable to import, the consumables (film and powder) are cheaper and more readily available, and the ability to print on any fabric means you can serve a wider range of customers. Additionally, DTF transfers can be printed in advance and stored for weeks before being applied, which means you can build an inventory of pre-printed designs and apply them on-demand when orders come in. This is a significant advantage for businesses that experience seasonal demand fluctuations.",
      "Our recommendation: if you are starting a T-shirt printing business in Kenya, DTF is the better choice for most use cases. It offers better durability, fabric versatility, lower startup costs, and the ability to print on demand. DTG is worth considering if you specialize in high-volume cotton T-shirt printing and prioritize the softest possible feel. Many successful print shops offer both methods and recommend the best option based on each customer's specific needs.",
    ],
  },
  {
    slug: "how-to-start-a-tshirt-printing-business-in-kenya",
    title: "How to Start a T-Shirt Printing Business in Kenya",
    excerpt:
      "Complete guide to starting a profitable T-shirt printing business in Kenya. Equipment costs, legal requirements, finding customers, pricing strategies, and marketing tips for Nairobi and beyond.",
    category: "Business Guide",
    date: "2026-06-24",
    readTime: "12 min read",
    keywords: ["T-shirt printing business Kenya", "start printing business Nairobi", "custom apparel Kenya", "DTF business Kenya"],
    content: [
      "Starting a T-shirt printing business in Kenya is one of the most accessible and profitable ventures you can undertake. The demand for custom apparel is growing rapidly, driven by corporate branding, school uniforms, sports teams, political campaigns, religious organizations, and the fashion industry. In this guide, we cover everything you need to know to launch and grow a successful T-shirt printing business in Kenya, from equipment selection to marketing strategies.",
      "The first step is choosing your printing method. The three main options are DTF (Direct-to-Film), DTG (Direct-to-Garment), and screen printing. For most new businesses in Kenya, we recommend DTF printing because it offers the best balance of affordability, versatility, and print quality. A basic DTF setup includes a DTF printer, heat press, PET film, DTF ink, and adhesive powder. Total startup cost ranges from KES 200,000 to KES 500,000 depending on the printer model and whether you buy new or used equipment.",
      "Legal requirements for starting a business in Kenya include registering your business name with the Kenya Revenue Authority (KRA), obtaining a business permit from your county government, and registering for VAT if your annual turnover exceeds KES 5 million. The business registration process can be done online through the eCitizen portal and typically takes 1-2 weeks. You will also need a physical location for your printing operations, which can be a home-based setup initially to reduce overhead costs.",
      "Finding wholesale T-shirt suppliers is critical for keeping your costs down. In Kenya, popular wholesale markets for blank T-shirts include Gikomba Market in Nairobi, Eastleigh, and Muthurwa Market. Blank cotton T-shirts typically cost between KES 150 and KES 400 per piece depending on quality and quantity. For premium brands, you can source from distributors of Gildan, Fruit of the Loom, or local manufacturers. Buying in bulk (50+ pieces) significantly reduces the per-unit cost.",
      "Pricing your T-shirt printing services correctly is essential for profitability. A common pricing model in Kenya is: blank T-shirt cost + printing cost + design cost + profit margin. For example, if a blank T-shirt costs KES 250, DTF printing costs KES 150, and design costs KES 200, your total cost is KES 600. Adding a 50% profit margin gives you a selling price of KES 1,200 per shirt. For bulk orders (50+ shirts), you can reduce the profit margin to 30% and still make good money due to volume.",
      "Marketing your T-shirt printing business in Kenya requires a multi-channel approach. Start by creating a WhatsApp Business profile with a catalog of your products and designs. WhatsApp is the primary communication tool for business in Kenya, and many customers prefer to order through WhatsApp rather than websites. Share photos of your work on Instagram and Facebook, and join local business groups on Facebook where you can advertise your services. Word-of-mouth referrals are powerful in Kenya, so deliver excellent quality and service to every customer.",
      "Building a portfolio of your work is essential for attracting customers. Take high-quality photos of every T-shirt you print, preferably worn by a model or displayed on a mannequin. Our free Mockup Generator tool lets you create professional 3D product mockups without needing a physical sample. Simply upload your design, choose a T-shirt color, and export a photorealistic image you can share on social media or send to clients via WhatsApp. This saves you the cost of printing samples for every inquiry.",
      "Target markets for T-shirt printing in Kenya include corporate companies needing branded uniforms, schools requiring custom uniforms and event shirts, churches and religious organizations needing event merchandise, sports teams and clubs, political campaigns during election seasons, and the growing fashion and streetwear market. Each market segment has different requirements for quality, quantity, and turnaround time. Corporate clients typically order 50-500 shirts per order, while individual customers order 1-10 shirts.",
      "Scaling your business involves reinvesting profits into better equipment, hiring staff, and expanding your product range. Once you are consistently fulfilling 100+ orders per month, consider upgrading to a larger DTF printer or adding DTG capability for cotton-specific jobs. You can also expand into related products like hoodies, caps, tote bags, and mugs. Our Canvas Designer tool can help you create gang sheets for multiple products, maximizing efficiency and reducing waste. Consider partnering with local designers who can create custom artwork for clients who do not have their own designs.",
      "At Creative Divine Concepts, we not only offer T-shirt printing services but also sell printing machines and provide training through Creative Academy. We help entrepreneurs start their own printing businesses by providing equipment, training, and ongoing support. If you are interested in starting a T-shirt printing business in Kenya, contact us at +254 711 669 113 or visit our studio in Githunguri Ndumberi, Kiambu. We offer free consultations and can help you choose the right equipment and business model for your budget and goals.",
    ],
  },
  {
    slug: "best-gang-sheet-sizes-for-dtf-printing",
    title: "Best Gang Sheet Sizes for DTF Printing",
    excerpt:
      "Complete guide to DTF gang sheet sizes. Learn standard dimensions, how to maximize efficiency, reduce waste, and build profitable gang sheets for your T-shirt printing business.",
    category: "DTF Printing",
    date: "2026-06-24",
    readTime: "7 min read",
    keywords: ["gang sheet sizes", "DTF gang sheet", "DTF printing sizes", "gang sheet builder"],
    content: [
      "Gang sheets are the secret to profitable DTF printing. By arranging multiple designs on a single sheet of PET film, you can dramatically reduce waste, save time, and increase your profit margin. But choosing the right gang sheet size is critical. Too small and you waste film on gaps and margins. Too large and you may struggle to fit it in your heat press. In this guide, we cover the standard gang sheet sizes used by professional DTF printers and how to choose the best size for your specific needs.",
      "The most common DTF gang sheet size in Kenya and globally is 22 inches wide by 12 inches tall (22x12). This size fits most standard DTF printers and heat presses, and it provides enough space for 4-6 average-sized T-shirt designs. The 22-inch width matches the printable width of most entry-level and mid-range DTF printers, which means you are using the full width of the film roll without waste. At 300 DPI, a 22x12 sheet produces a 6600x3600 pixel image, which is high enough resolution for professional-quality prints.",
      "For businesses that need to print larger designs or more designs per sheet, the 22x19 inch size is the next step up. This size accommodates 6-10 designs and is ideal for bulk orders where you need to print the same design in multiple sizes (S, M, L, XL, XXL). The 22x19 sheet is also commonly used for full-front designs that are 14-16 inches wide. At Creative Divine Concepts, our Canvas Designer tool includes presets for all standard DTF gang sheet sizes, including 22x12, 22x19, 22x24, and 22x48 inches.",
      "The 22x24 inch gang sheet is popular for medium-volume print runs. This size can fit 8-15 designs depending on their individual sizes. It is also the preferred size for printing designs that will be applied to both the front and back of a T-shirt in a single pressing operation. The 22x24 sheet requires a larger heat press (at least 16x20 inches), so make sure your equipment can accommodate it before choosing this size.",
      "For high-volume operations, gang sheets of 22x48, 22x60, or even 22x120 inches are used. These large sheets are typically printed on commercial DTF printers with roll-to-roll capabilities. A 22x120 inch sheet can hold 40-60 designs, making it ideal for large bulk orders. However, these large sheets require careful planning and arrangement to ensure efficient use of space. Our Canvas Designer tool includes an auto-arrange feature that uses bin-packing algorithms to arrange designs efficiently, reducing waste by 15-30% compared to manual arrangement.",
      "The key to efficient gang sheet building is understanding the concept of nesting. Nesting is the process of arranging designs on a sheet so that the gaps between them are minimized. The goal is to leave only enough space between designs for cutting (typically 0.25 inches). Designs should be arranged in rows, with each row offset slightly to fill gaps left by the row above. Irregularly shaped designs can be rotated to fit more efficiently. Our Canvas Designer tool handles this automatically with the auto-arrange feature, but understanding the principle helps you plan your designs for maximum efficiency.",
      "DTG (Direct-to-Garment) printing uses different sheet sizes because the printable area is determined by the printer platen size rather than film width. Common DTG platen sizes are 14x16 inches (standard), 16x20 inches (large), and 10x12 inches (youth). If you offer both DTF and DTG printing, you need to prepare your gang sheets differently for each method. DTF gang sheets are limited by film width (typically 22 inches), while DTG gang sheets are limited by platen size.",
      "Calculating the cost per design on a gang sheet is straightforward. First, determine the cost of your film and ink per square inch. For example, if a 22x12 inch sheet of film costs KES 100 and uses KES 50 worth of ink, your total cost per sheet is KES 150. If you fit 6 designs on the sheet, your cost per design is KES 25. Add the cost of the blank T-shirt (KES 250) and your total cost per printed shirt is KES 275. Sell at KES 1,000-1,500 and your profit margin is 70-80%. This is why gang sheet efficiency directly impacts your bottom line.",
      "To maximize efficiency, always group designs by size and color. Similar-sized designs nest more efficiently, and grouping by color reduces ink changes if you are printing multiple sheets. Use our free Canvas Designer tool to build your gang sheets visually, with real-time preview, grid snapping, and auto-arrange. Export at 300 DPI for print-ready files, or use the SVG export option for vector designs that need to be scaled. The tool also supports transparent backgrounds, so your designs will have clean edges without white borders.",
    ],
  },
];

export function BlogView({ onNavigate }: BlogViewProps) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return <BlogPostView post={selectedPost} onBack={() => setSelectedPost(null)} onNavigate={onNavigate} />;
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <Badge className="mb-3 bg-primary/10 text-primary border-primary/30">
            <Icons.BookOpen className="mr-1.5 h-3 w-3" />
            Creative Blog
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Insights &amp; <span className="text-gradient-cyan">Guides</span>
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Expert guides on DTF printing, T-shirt business, design tips, and web development in Kenya.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="nura-card p-6 cursor-pointer group hover:border-primary/40 transition"
              onClick={() => setSelectedPost(post)}
              itemScope
              itemType="https://schema.org/BlogPosting"
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">{post.category}</Badge>
                <span className="text-xs text-muted-foreground" itemProp="datePublished">{post.date}</span>
                <span className="text-xs text-muted-foreground">{post.readTime}</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition" itemProp="headline">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4" itemProp="description">{post.excerpt}</p>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                Read More <Icons.ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </div>
              {/* Hidden SEO keywords */}
              <meta itemProp="keywords" content={post.keywords.join(", ")} />
            </motion.article>
          ))}
        </div>

        <div className="mt-12 nura-card p-8 text-center">
          <h3 className="font-display text-xl font-bold mb-2 text-foreground">Need Help with Your Project?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our team is ready to help with T-shirt printing, web design, and branding in Kenya.
          </p>
          <Button onClick={() => onNavigate("contact")} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Get in Touch <Icons.ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BlogPostView({ post, onBack, onNavigate }: { post: BlogPost; onBack: () => void; onNavigate: (view: any) => void }) {
  // Blog article structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Creative Divine Concepts Ltd",
    },
    publisher: {
      "@type": "Organization",
      name: "Creative Divine Concepts Ltd",
      logo: {
        "@type": "ImageObject",
        url: "https://creativedivineconcepts.com/logo.jpeg",
      },
    },
    keywords: post.keywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://creativedivineconcepts.com/#blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="container mx-auto max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition"
        >
          <Icons.ArrowLeft className="h-4 w-4" /> Back to Blog
        </button>

        <article itemScope itemType="https://schema.org/BlogPosting">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">{post.category}</Badge>
            <span className="text-xs text-muted-foreground" itemProp="datePublished">{post.date}</span>
            <span className="text-xs text-muted-foreground">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4 text-foreground" itemProp="headline">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed" itemProp="description">
            {post.excerpt}
          </p>

          <div className="space-y-6">
            {post.content.map((paragraph, i) => (
              <p key={i} className="text-base text-foreground/90 leading-relaxed" itemProp="articleBody">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <span key={keyword} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 nura-card p-6 text-center">
            <h3 className="font-display text-lg font-bold mb-2 text-foreground">Ready to Start Printing?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contact Creative Divine Concepts for professional DTF printing, web design, and branding services in Kenya.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button onClick={() => onNavigate("contact")} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get a Quote <Icons.ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href="https://wa.me/254711669113"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn h-10 px-6 inline-flex items-center"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
