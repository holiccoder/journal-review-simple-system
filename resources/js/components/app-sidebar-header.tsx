import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { getHeaderActions } from '@/lib/header-actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props;
    const user = auth?.user as Record<string, unknown> | undefined;
    const headerActions = getHeaderActions();
    const getInitials = useInitials();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex w-full items-center justify-between">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
                <div className="flex items-center gap-3">
                    {headerActions}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-9 gap-2 px-2">
                                    <Avatar className="h-7 w-7 overflow-hidden rounded-full">
                                        <AvatarImage src={user.avatar as string} alt={user.name as string} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-xs text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(user.name as string)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden text-sm font-medium md:inline">
                                        {user.name as string}
                                    </span>
                                    <ChevronsUpDown className="size-3.5 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="min-w-56 rounded-lg" align="end">
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                            <AvatarImage src={user.avatar as string} alt={user.name as string} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(user.name as string)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-medium">{user.name as string}</span>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {user.email as string}
                                            </span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link className="block w-full cursor-pointer" href={edit()}>
                                            <Settings className="mr-2" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        className="block w-full cursor-pointer"
                                        href={logout()}
                                        as="button"
                                        data-test="logout-button"
                                    >
                                        <LogOut className="mr-2" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
