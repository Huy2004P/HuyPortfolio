import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();

  const parseMarkdown = (md) => {
    if (!md) return '';
    let html = md;
    
    // Headings
    html = html.replace(/^#\s+(.*)$/gm, '<h1 class="text-3xl sm:text-4xl font-display font-bold tracking-tight my-6">$1</h1>');
    html = html.replace(/^##\s+(.*)$/gm, '<h2 class="text-2xl font-semibold tracking-tight my-4 border-b border-apple-grayBorderSoft dark:border-apple-graphiteA pb-2">$1</h2>');
    html = html.replace(/^###\s+(.*)$/gm, '<h3 class="text-xl font-medium my-3">$1</h3>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // List items
    html = html.replace(/^\*\s+(.*)$/gm, '<li>$1</li>');
    html = html.replace(/^-\s+(.*)$/gm, '<li>$1</li>');
    
    // Format paragraphs
    const blocks = html.split(/\n\n+/);
    const formattedBlocks = blocks.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (trimmed.startsWith('<h')) return trimmed;
      if (trimmed.startsWith('<li>')) {
        return `<ul class="list-disc pl-5 my-4 space-y-1">${trimmed}</ul>`;
      }
      return `<p class="my-4 leading-relaxed">${trimmed.replace(/\n/g, '<br/>')}</p>`;
    });
    
    return formattedBlocks.join('\n');
  };

  const defaultContent = `# Terms of Service

Welcome to our website. If you continue to browse and use this website and our applications, you are agreeing to comply with and be bound by the following terms and conditions of use.

## Use License
Permission is granted to temporarily download one copy of the materials (information or software) on our portfolio website for personal, non-commercial transitory viewing only.

## Disclaimer
The materials on our website are provided on an \'as is\' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`;

  const title = t('terms_title', 'Terms of Service');
  const contentHtml = parseMarkdown(t('terms_content', defaultContent));

  return (
    <div className="max-w-3xl mx-auto py-4 animate-fade-in text-apple-ink dark:text-apple-white">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight my-6">{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
};

export default Terms;
