import { Repository, DeepPartial } from 'typeorm';

export async function saveSingleRichText<
  TEntity extends { id: number; content: string | null }
>(
  repo: Repository<TEntity>,
  content?: string | null,
): Promise<TEntity> {
  const existing = await repo.findOne({
    where: {},
    order: { id: 'ASC' } as any, // TypeScript khó infer generic với order
  });

  if (existing) {
    existing.content = content ?? null;
    return repo.save(existing); // TypeScript OK
  }

  // Dùng create() để đảm bảo single entity
  const entity = repo.create({ content: content ?? null } as DeepPartial<TEntity>);

  // Save single entity → TypeScript sẽ infer Promise<TEntity>
  return repo.save(entity);
}