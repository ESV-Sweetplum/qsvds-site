import User from '@/interfaces/user';
import { createHash } from 'crypto';

export default function GenerateHash(id: number) {
  const hash = createHash('sha256')
    .update(`${process.env.SALT}-${id}`)
    .digest('base64');

  return hash;
}
