import { useForm, usePage } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { type FormEvent, useRef } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    open: boolean;
    onClose: () => void;
    submission: {
        id: number;
        file_name: string;
        version: string;
        replace_url: string;
    };
};

export default function ReplaceFileModal({ open, onClose, submission }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { auth } = usePage().props;
    const isAdmin = (auth?.user as Record<string, unknown>)?.is_admin ?? false;

    const form = useForm({
        file: null as File | null,
        version: submission.version,
        status: 'under review',
        comment: '',
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
                onClose();
            },
        });
    };

    const handleClose = () => {
        form.reset();
        form.setData('file', null);
        form.clearErrors();
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-sm">Update File</DialogTitle>
                    <DialogDescription className="text-sm">
                        Upload a new file to update{' '}
                        <span className="font-medium text-foreground">
                            {submission.file_name}
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

                    {!isAdmin && (
                        <div className="grid gap-1.5">
                            <Label htmlFor="replace-version" className="text-sm">
                                Version
                            </Label>
                            <Input
                                id="replace-version"
                                type="text"
                                value={form.data.version}
                                onChange={(e) =>
                                    form.setData('version', e.target.value)
                                }
                                className="h-8 text-sm"
                                placeholder="1.0"
                            />
                            <InputError message={form.errors.version} />
                        </div>
                    )}

                    {isAdmin && (
                        <>
                            <div className="grid gap-1.5">
                                <Label htmlFor="replace-status" className="text-sm">
                                    Status
                                </Label>
                                <select
                                    id="replace-status"
                                    value={form.data.status}
                                    onChange={(e) =>
                                        form.setData('status', e.target.value)
                                    }
                                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="under review">Under Review</option>
                                    <option value="needs revision">Needs Revision</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="recommend submission">Recommend Submission</option>
                                </select>
                                <InputError message={form.errors.status} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="replace-comment" className="text-sm">
                                    Comment
                                </Label>
                                <textarea
                                id="replace-comment"
                                value={form.data.comment}
                                onChange={(e) =>
                                    form.setData('comment', e.target.value)
                                }
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Add a comment..."
                            />
                            <InputError message={form.errors.comment} />
                        </div>
                        </>
                    )}

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-sm"
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="text-sm"
                            disabled={form.processing || !form.data.file}
                        >
                            {form.processing && <Spinner />}
                            Upload
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
