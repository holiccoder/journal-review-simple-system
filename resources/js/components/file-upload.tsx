import { useForm } from '@inertiajs/react';
import { Upload, X } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function FileUpload({ title = 'Submit File' }: { title?: string }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);

    const form = useForm({
        title: '',
        name: '',
        email: '',
        files: [] as File[],
        version: '1.0',
    });

    const addFiles = (newFiles: File[]) => {
        const current = form.data.files;
        const merged = [...current, ...newFiles];
        form.setData('files', merged);
        form.clearErrors('files');
    };

    const removeFile = (index: number) => {
        const updated = form.data.files.filter((_, i) => i !== index);
        form.setData('files', updated);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        if (selected.length > 0) {
            addFiles(selected);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = Array.from(e.dataTransfer.files ?? []);
        if (dropped.length > 0) {
            addFiles(dropped);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post('/submissions', {
            onSuccess: () => {
                form.reset();
                form.setData('files', []);
                form.setData('title', '');
                form.setData('name', '');
                form.setData('email', '');
            },
        });
    };

    const filesCount = form.data.files.length;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4"
        >
            <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-medium">{title}</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            required
                            placeholder="Enter title"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                        />
                        <InputError message={form.errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            required
                            placeholder="Your name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="email@example.com"
                            value={form.data.email}
                            onChange={(e) => form.setData('email', e.target.value)}
                        />
                        <InputError message={form.errors.email} />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div
                        className={`flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors ${
                            dragOver
                                ? 'border-primary bg-primary/5'
                                : 'border-sidebar-border/70'
                        }`}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                        }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                    >
                        {filesCount > 0 ? (
                            <div className="flex w-full flex-col gap-1.5 text-sm">
                                {form.data.files.map((file, index) => (
                                    <div
                                        key={`${file.name}-${index}`}
                                        className="flex items-center justify-between gap-2"
                                    >
                                        <span className="truncate text-muted-foreground">
                                            {file.name}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5 shrink-0"
                                            onClick={() => removeFile(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <Upload className="h-6 w-6 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Drag & drop or click to browse
                                </p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {filesCount > 0 ? 'Add more files' : 'Browse files'}
                        </Button>
                    </div>
                    <InputError message={form.errors.files} />
                    {form.errors['files.0'] && (
                        <InputError message={form.errors['files.0']} />
                    )}

                    <Button
                        type="submit"
                        size="sm"
                        className="w-full text-sm"
                        disabled={form.processing || filesCount === 0}
                    >
                        {form.processing && <Spinner />}
                        Submit
                    </Button>
                </div>
            </div>
        </form>
    );
}
