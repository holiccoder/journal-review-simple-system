import { useForm, usePage } from '@inertiajs/react';
import { Download, Upload, X } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { truncateTitle } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type FileEntry = {
    id: number;
    user_id: number | null;
    is_uploader_admin?: boolean;
    file_name: string;
    file_size: number;
    file_extension: string;
    created_at: string | null;
    download_url: string;
};

type HistoryEntry = {
    id: number;
    file_name: string;
    status: string;
    comment: string | null;
    submitted_at: string | null;
    download_url: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onUploaded: () => void;
    submission: {
        id: number;
        title: string;
        name: string;
        email: string;
        version: string;
        status: string;
        recommendations: string | null;
        submitted_at: string | null;
        download_url: string;
        replace_url: string;
        files: FileEntry[];
        histories: HistoryEntry[];
    };
};

function statusVariant(status: string) {
    switch (status) {
        case 'recommended for journal submission':
        case 'approved':
        case 'accepted':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'rejected':
        case 'needs revision':
            return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
        case 'under review':
        default:
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
}

function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

export default function SubmissionDetailModal({ open, onClose, onUploaded, submission }: Props) {
    const [showUpload, setShowUpload] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props;
    const authUser = auth?.user as Record<string, unknown>;
    const isAdmin = (authUser?.is_admin ?? false) as boolean;
    const currentUserId = authUser?.id as number;

    const form = useForm({
        file: null as File | null,
        status: 'under review',
        recommendations: '',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        form.setData('file', file);
        form.clearErrors('file');
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post(submission.replace_url, {
            onSuccess: () => {
                form.reset();
                form.setData('file', null);
                setShowUpload(false);
                onUploaded();
            },
        });
    };

    const handleClose = () => {
        setShowUpload(false);
        form.reset();
        form.setData('file', null);
        form.clearErrors();
        onClose();
    };

    const handleBack = () => {
        setShowUpload(false);
        form.reset();
        form.setData('file', null);
        form.clearErrors();
    };

    const uploadButtonLabel = isAdmin ? 'Start Review' : 'Upload Revised Files';
    const submitButtonLabel = isAdmin ? 'Submit' : 'Upload Revised Files';
    const dialogTitle = isAdmin ? 'Submission Details' : 'Review Details';

    // Admin: show all files except admin-uploaded. Non-admin: only show admin-uploaded files.
    const visibleFiles = isAdmin
        ? submission.files.filter((f) => f.is_uploader_admin !== true)
        : submission.files.filter((f) => f.is_uploader_admin === true);

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-2xl">
                {showUpload ? (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    ← Back
                                </button>
                            </div>
                            <DialogTitle className="text-sm">Upload File</DialogTitle>
                            <DialogDescription className="text-sm">
                                Upload a new file for{' '}
                                <span className="font-medium text-foreground">
                                    {truncateTitle(submission.title)}
                                </span>
                                . The current version will be saved in history.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-sidebar-border/70 p-4">
                                {form.data.file ? (
                                    <div className="flex w-full items-center justify-between gap-2 text-sm">
                                        <span className="truncate text-muted-foreground">
                                            {form.data.file.name}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 shrink-0"
                                            onClick={() => {
                                                form.setData('file', null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop or click to browse
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="text-sm"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            Browse files
                                        </Button>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <InputError message={form.errors.file} />

                            {isAdmin && (
                                <>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="upload-status" className="text-sm">
                                            Status
                                        </Label>
                                        <select
                                            id="upload-status"
                                            value={form.data.status}
                                            onChange={(e) =>
                                                form.setData('status', e.target.value)
                                            }
                                            className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        >
                                            <option value="under review" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Under Review</option>
                                            <option value="needs revision" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Needs Revision</option>
                                            <option value="recommended for journal submission" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Recommended for Journal Submission</option>
                                        </select>
                                        <InputError message={form.errors.status} />
                                    </div>

                                    <div className="grid gap-1.5">
                                        <Label htmlFor="upload-recommendations" className="text-sm">
                                            Recommendations
                                        </Label>
                                        <textarea
                                            id="upload-recommendations"
                                            value={form.data.recommendations}
                                            onChange={(e) =>
                                                form.setData('recommendations', e.target.value)
                                            }
                                            className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            placeholder="Add recommendations..."
                                        />
                                        <InputError message={form.errors.recommendations} />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="text-sm"
                                    disabled={form.processing}
                                >
                                    {form.processing && <Spinner />}
                                    {submitButtonLabel}
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-sm">{dialogTitle}</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                            {isAdmin ? (
                                /* ---------- Admin view ---------- */
                                <>
                                    <div>
                                        <h4 className="mb-1 text-sm font-medium">Title</h4>
                                        <p className="text-sm text-muted-foreground">{submission.title}</p>
                                    </div>

                                    {/* Files table */}
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Files</h4>
                                        {visibleFiles.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No files.</p>
                                        ) : (
                                            <div className="overflow-x-auto rounded-md border">
                                                <table className="w-full text-left text-sm">
                                                    <thead>
                                                        <tr className="border-b bg-muted/50">
                                                            <th className="px-3 py-2 font-medium text-muted-foreground">File Name</th>
                                                            <th className="px-3 py-2 font-medium text-muted-foreground">Extension</th>
                                                            <th className="px-3 py-2 font-medium text-muted-foreground">Uploaded</th>
                                                            <th className="px-3 py-2 font-medium text-muted-foreground"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {visibleFiles.map((file) => (
                                                            <tr key={file.id} className="border-b last:border-0">
                                                                <td className="px-3 py-2">{file.file_name}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className="rounded bg-muted px-1 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                                                                        {file.file_extension}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 text-muted-foreground">
                                                                    {file.created_at ?? '—'}
                                                                </td>
                                                                <td className="px-3 py-2 text-right">
                                                                    <a href={file.download_url}>
                                                                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                                                                            <Download className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* ---------- Non-admin view ---------- */
                                <>
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <h4 className="mb-1 text-sm font-medium">Title</h4>
                                            <p className="text-sm text-muted-foreground">{submission.title}</p>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="font-semibold mr-1">Status: </span>
                                            <span
                                                className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusVariant(
                                                    submission.status,
                                                )}`}
                                            >
                                                {submission.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 text-sm font-semibold">Comments</h4>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {submission.recommendations ?? '—'}
                                        </p>
                                    </div>

                                    {/* Files table — only files uploaded by admin */}
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Files</h4>
                                        {visibleFiles.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">No files.</p>
                                        ) : (
                                            <div className="overflow-x-auto rounded-md border">
                                                <table className="w-full text-left text-sm">
                                                    <thead>
                                                        <tr className="border-b bg-muted/50">
                                                            <th className="px-3 py-2 font-normal text-muted-foreground">File Name</th>
                                                            <th className="px-3 py-2 font-normal text-muted-foreground">Extension</th>
                                                            <th className="px-3 py-2 font-normal text-muted-foreground">Uploaded</th>
                                                            <th className="px-3 py-2 font-normal text-muted-foreground"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {visibleFiles.map((file) => (
                                                            <tr key={file.id} className="border-b last:border-0">
                                                                <td className="px-3 py-2">{file.file_name}</td>
                                                                <td className="px-3 py-2">
                                                                    <span className="rounded bg-muted px-1 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                                                                        {file.file_extension}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2 text-muted-foreground">
                                                                    {file.created_at ?? '—'}
                                                                </td>
                                                                <td className="px-3 py-2 text-right">
                                                                    <a href={file.download_url}>
                                                                        <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                                                                            <Download className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                size="sm"
                                className="text-sm"
                                onClick={() => setShowUpload(true)}
                            >
                                <Upload className="mr-1 h-3.5 w-3.5" />
                                {uploadButtonLabel}
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
