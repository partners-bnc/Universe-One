// content.js can't hold JSX, so titles are written as ['plain ', { bold: 'bold part' }] and turned into JSX here.
export default function richTitle(parts) {
  return parts.map((p, i) => (typeof p === 'string' ? p : <b key={i}>{p.bold}</b>));
}
