import React from 'react';
import { SignOut } from '@phosphor-icons/react/dist/csr/SignOut';
import { GearSix } from '@phosphor-icons/react/dist/csr/GearSix';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserProfileProps {
    user: any;
    isCollapsed: boolean;
    onLogout: () => void;
}

export const UserProfile = ({ user, isCollapsed, onLogout }: UserProfileProps) => {
    if (!user) {
        return (
            <div className="p-4 border-t border-white/5 mt-auto bg-black/20">
                <Button
                    variant="glass"
                    className={cn("w-full justify-start gap-3", isCollapsed && "justify-center px-0")}
                    asChild
                >
                    <a href="/login">
                        <GearSix size={18} weight="duotone" />
                        {!isCollapsed && <span>Login / Sign Up</span>}
                    </a>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 border-t border-white/5 mt-auto bg-black/20 backdrop-blur-md">
            <div className={cn(
                "flex items-center gap-3",
                isCollapsed ? "justify-center flex-col gap-4" : "justify-between"
            )}>
                <div className={cn("flex items-center gap-3 overflow-hidden", isCollapsed && "justify-center")}>
                    <TooltipProvider>
                        <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Avatar className="h-9 w-9 border border-white/10 shadow-sm cursor-default">
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback className="bg-accent/20 text-accent">
                                        {user.email?.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            {isCollapsed && (
                                <TooltipContent side="right">
                                    <p>{user.user_metadata?.full_name || user.email}</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </TooltipProvider>

                    {!isCollapsed && (
                        <div className="flex flex-col truncate min-w-0">
                            <span className="text-sm font-medium text-white truncate">
                                {user.user_metadata?.full_name || user.email.split('@')[0]}
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                {user.email}
                            </span>
                        </div>
                    )}
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onLogout}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                                <SignOut size={16} weight="bold" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Sign Out</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
