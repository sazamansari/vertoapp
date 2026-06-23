export declare enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
}
export type Member = {
    $id: string;
    workspaceId: string;
    userId: string;
    name: string;
    email: string;
    role: MemberRole;
};
//# sourceMappingURL=types.d.ts.map