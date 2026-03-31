import { Repository } from 'typeorm';

/**
 * Upsert "single rich text" pattern:
 * - Always read the first row (ordered by id ASC)
 * - If exists: update `content`
 * - If not: create a new row with `content`
 *
 * All our rich-text tables (gala/mice/teambuilding) share the same shape:
 * { id, content }
 */
export async function saveSingleRichText<TEntity extends { id: number; content: string | null }>(
  repo: Repository<TEntity>,
  content: string | null | undefined,
): Promise<TEntity> {
  const existing = await repo.findOne({ where: {}, order: { id: 'ASC' } });

  if (existing) {
    existing.content = content ?? null;
    return repo.save(existing);
  }

  const entity = repo.create({ content: content ?? null } as Partial<TEntity>);
  return repo.save(entity);
}

