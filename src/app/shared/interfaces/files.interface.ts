export interface FileInterface {
    id: number
    key: string
    name: string
    extension: string
    size: number
    blurHash: string | null
    path: string
    url: string
    contentType: string
    bucket: string
    createdAt: Date
}