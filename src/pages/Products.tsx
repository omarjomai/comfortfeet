import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, type Product } from '../data/products';
import { ProductCard } from '../components/ProductCard';

type Sort = 'name' | 'asc' | 'desc';

export function Products() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('c') as Product['category'] | null;
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const [sort, setSort] = useState<Sort>('name');
  const list = useMemo(() => {
    const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const words = norm(q).split(/\s+/).filter(Boolean);
    const l = PRODUCTS.filter((p) => !cat || p.category === cat).filter((p) => {
      if (!words.length) return true;
      const hay = norm([p.name, p.category, p.colors.map((c) => c.name).join(' '), p.badge ?? ''].join(' '));
      return words.every((w) => hay.includes(w));
    });
    return [...l].sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.name.localeCompare(b.name)));
  }, [cat, sort, q]);
  return (
    <div className="container section">
      <h1 className="page-title">{q ? `Résultats pour « ${params.get('q')} »` : cat ? CATEGORIES.find((c) => c.id === cat)?.label : 'Toutes nos chaussettes'}</h1>
      <p className="muted small">{list.length} article{list.length > 1 ? 's' : ''}</p>
      <div className="filters">
        <button className={!cat ? 'pill active' : 'pill'} onClick={() => setParams({})}>Tous</button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={cat === c.id ? 'pill active' : 'pill'} onClick={() => setParams({ c: c.id })}>{c.label}</button>
        ))}
      </div>
      <label className="sort">
        Trier par :
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="name">Nom</option>
          <option value="asc">Prix croissant</option>
          <option value="desc">Prix décroissant</option>
        </select>
      </label>
      {list.length ? (
        <div className="grid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      ) : (
        <p className="empty-search">Aucun produit trouvé. Essayez « coton », « sport » ou une couleur.</p>
      )}
    </div>
  );
}
