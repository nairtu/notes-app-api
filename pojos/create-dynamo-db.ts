export interface CreateDocumentItem {
    userId: string | null,
    noteId: string,
    content: string,
    attachment: string,
    createdAt: number
}

export interface ContentAttachment {
    content: string,
    attachment: string
}