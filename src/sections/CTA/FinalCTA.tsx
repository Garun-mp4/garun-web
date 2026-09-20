import React from 'react';
import { LayerButton } from '../../components/ui/LayerButton.js';
import { openContact } from '../../utils/contact.js';

export function FinalCTA(): React.ReactElement {
  return <section className="final-cta" id="contact" aria-labelledby="final-cta-title">
    <div className="final-cta__panel">
      <span className="final-cta__label">МОЖЕМ НАЧАТЬ С КОРОТКОГО ОБСУЖДЕНИЯ</span>
      <h2 id="final-cta-title">ГОТОВЫ ОБСУДИТЬ<br/>НОВЫЙ САЙТ?</h2>
      <LayerButton variant="light" portrait onClick={() => openContact({ source: 'final_cta' })}>ОБСУДИТЬ ПРОЕКТ</LayerButton>
    </div>
  </section>;
}
