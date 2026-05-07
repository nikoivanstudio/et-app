import { postPatchSchema } from '@/entities/post/model/schemas';

describe('postPatchSchema', () => {
  it('accepts partial post updates when id is present', () => {
    const result = postPatchSchema.safeParse({
      id: 12,
      content: 'Updated content'
    });

    expect(result.success).toBe(true);
  });

  it('accepts API date strings in edit payloads', () => {
    const result = postPatchSchema.safeParse({
      id: 12,
      createdAt: '2026-05-07T10:00:00.000Z'
    });

    expect(result.success).toBe(true);
  });

  it('requires id for patch requests', () => {
    const result = postPatchSchema.safeParse({
      content: 'Updated content'
    });

    expect(result.success).toBe(false);
  });
});
