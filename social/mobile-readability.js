(() => {
  const improve = () => {
    for (const slide of document.querySelectorAll('.slide')) {
      for (const element of slide.querySelectorAll('*')) {
        const hasOwnText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
        if (!hasOwnText) continue;
        const style = getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;

        const secondary = element.tagName === 'SMALL' || element.matches('.eyebrow,.counter,.brand,.brand *');
        const minimum = secondary ? 18 : 22;
        const current = Number.parseFloat(style.fontSize);
        if (current < minimum) element.style.setProperty('font-size', `${minimum}px`, 'important');

        const lineHeight = Number.parseFloat(style.lineHeight);
        if (Number.isFinite(lineHeight) && lineHeight < minimum * 1.15) {
          element.style.setProperty('line-height', '1.2', 'important');
        }
        const letterSpacing = Number.parseFloat(style.letterSpacing);
        if (current <= 22 && Number.isFinite(letterSpacing) && letterSpacing > 2.6) {
          element.style.setProperty('letter-spacing', '1.6px', 'important');
        }
      }
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', improve, { once: true });
  else improve();
})();
