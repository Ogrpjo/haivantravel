import { DeepPartial, Repository } from 'typeorm';

export async function saveSingleRichText<
  TEntity extends {
    id: number;
    content: string | null;
    html_content: string | null;
    css_content: string | null;
  }
>(
  repo: Repository<TEntity>,
  payload?: {
    content?: string | null;
    html_content?: string | null;
    css_content?: string | null;
  },
): Promise<TEntity> {
  const existing = await repo.findOne({
    where: {},
    order: { id: 'ASC' } as any, // TypeScript khó infer generic với order
  });

  if (existing) {
    if (payload?.content !== undefined) {
      existing.content = payload.content ?? null;
    }
    if (payload?.html_content !== undefined) {
      existing.html_content = payload.html_content ?? null;
    }
    if (payload?.css_content !== undefined) {
      existing.css_content = payload.css_content ?? null;
    }
    return repo.save(existing); // TypeScript OK
  }

  // Dùng create() để đảm bảo single entity
  const entity = repo.create({
    content: payload?.content ?? null,
    html_content: payload?.html_content ?? null,
    css_content: payload?.css_content ?? null,
  } as DeepPartial<TEntity>);

  // Save single entity → TypeScript sẽ infer Promise<TEntity>
  return repo.save(entity);
}