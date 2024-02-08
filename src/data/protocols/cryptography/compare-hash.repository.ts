export interface CompareHashRepository {
  compare: (plainText: string, hashedText: string) => Promise<boolean>
}
