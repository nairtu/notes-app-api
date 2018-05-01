export interface CreateDocumentItem {
    userId: string | null,
    noteId: string,
    content: string,
    attachment: string,
    createdAt: number
}

export interface CreateDocumentRequest {
    content: string,
    attachment: string
}