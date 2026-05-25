const Page = require('../models/Page');

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ensureUniqueSlug = async (slug, excludeId = null) => {
  let uniqueSlug = slug;
  let counter = 0;
  const query = excludeId ? { slug: uniqueSlug, _id: { $ne: excludeId } } : { slug: uniqueSlug };

  while (await Page.findOne(query)) {
    counter += 1;
    uniqueSlug = `${slug}-${counter}`;
    query.slug = uniqueSlug;
  }

  return uniqueSlug;
};

const getPages = async (req, res) => {
  try {
    const pages = await Page.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug, isPublished: true });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminPages = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPage = async (req, res) => {
  try {
    const { title, excerpt, content, metaTitle, metaDescription, slug, isPublished } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const rawSlug = slug?.trim() || generateSlug(title);
    const finalSlug = await ensureUniqueSlug(generateSlug(rawSlug));

    const page = await Page.create({
      title,
      slug: finalSlug,
      excerpt: excerpt || '',
      content,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || '',
      isPublished: typeof isPublished === 'boolean' ? isPublished : true,
    });

    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    const { title, excerpt, content, metaTitle, metaDescription, slug, isPublished } = req.body;
    if (title) page.title = title;
    if (content) page.content = content;
    page.excerpt = excerpt || page.excerpt;
    page.metaTitle = metaTitle || page.metaTitle;
    page.metaDescription = metaDescription || page.metaDescription;
    page.isPublished = typeof isPublished === 'boolean' ? isPublished : page.isPublished;

    if (slug || title) {
      const rawSlug = slug?.trim() || generateSlug(page.title);
      page.slug = await ensureUniqueSlug(generateSlug(rawSlug), page._id);
    }

    await page.save();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) return res.status(404).json({ message: 'Page not found' });

    await page.deleteOne();
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPages,
  getPageBySlug,
  getAdminPages,
  getAdminPageById,
  createPage,
  updatePage,
  deletePage,
};
