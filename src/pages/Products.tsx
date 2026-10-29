import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CATEGORIES, PRODUCTS, type Product } from '../data/products';
import { ProductCard } from '../components/ProductCard';

type Sort = 'name' | 'asc' | 'desc';

export function Products() {
  const [params, setParams] = useSearchParams();
  const cat = params.get('c') as Product['category'] | null;
  const [sort, setSort] = useState<Sort>('name');
  const list = useMemo(() => {
    const l = PRODUCTS.filter((p) => !cat || p.category === cat);
    return [...l].sort((a, b) => (sort === 'asc' ? a.price - b.price : sort === 'desc' ? b.price - a.price : a.name.localeCompare(b.name)));
  }, [cat, sort]);
  return (
    <div className="container section">
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
      <div className="grid grid-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
    </div>
  );
}
