-- Admin CMS Tables for Homepage Management

-- Homepage hero carousel images
CREATE TABLE homepage_carousel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  link_url VARCHAR(500),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Homepage content sections (taglines, text blocks, etc.)
CREATE TABLE homepage_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'hero_tagline', 'merchant_cta_title'
  content_type VARCHAR(50) NOT NULL, -- 'text', 'html', 'image'
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional data like styling, links
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Featured collections management
CREATE TABLE homepage_featured_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  aesthetic_id UUID REFERENCES aesthetics(id) ON DELETE SET NULL,
  product_ids UUID[] DEFAULT ARRAY[]::UUID[],
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin activity log
CREATE TABLE admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL, -- 'create', 'update', 'delete'
  resource_type VARCHAR(100) NOT NULL, -- 'carousel', 'content', 'collection'
  resource_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_carousel_order ON homepage_carousel(display_order);
CREATE INDEX idx_carousel_active ON homepage_carousel(is_active);
CREATE INDEX idx_content_section ON homepage_content(section_key);
CREATE INDEX idx_featured_order ON homepage_featured_collections(display_order);
CREATE INDEX idx_admin_log_email ON admin_activity_log(admin_email);
CREATE INDEX idx_admin_log_created ON admin_activity_log(created_at DESC);

-- Insert default content
INSERT INTO homepage_content (section_key, content_type, content, metadata) VALUES
('hero_tagline', 'text', 'Shop By Vibe', '{"fontSize": "5xl", "fontWeight": "bold"}'),
('merchant_cta_title', 'text', 'Sell Your Vibe. Become a MoodRobe Merchant', '{"fontSize": "3xl"}'),
('merchant_cta_subtitle', 'text', 'Join our community of fashion creators', '{"fontSize": "lg"}'),
('style_quiz_title', 'text', 'NOT SURE? TAKE THE QUIZ AND FIND YOUR VIBE', '{"fontSize": "3xl"}'),
('style_quiz_subtitle', 'text', 'Answer a few questions and discover the perfect aesthetic for your style', '{"fontSize": "lg"}');

-- Insert default carousel image (using the current hero image)
INSERT INTO homepage_carousel (image_url, title, subtitle, display_order, is_active) VALUES
('https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=1600&h=900&fit=crop', 
 'Shop By Vibe', 
 'Discover Your Perfect Style', 
 1, 
 true);

-- Add comment for documentation
COMMENT ON TABLE homepage_carousel IS 'Manages rotating hero images on the homepage';
COMMENT ON TABLE homepage_content IS 'Stores editable text content for homepage sections';
COMMENT ON TABLE homepage_featured_collections IS 'Curated product collections featured on homepage';
COMMENT ON TABLE admin_activity_log IS 'Audit trail for admin actions';