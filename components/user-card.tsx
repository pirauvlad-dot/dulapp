import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/types'
import { cn } from '@/lib/utils'

interface UserCardProps {
  user: User
  showFollowButton?: boolean
  className?: string
}

export function UserCard({ user, showFollowButton = true, className }: UserCardProps) {
  return (
    <div className={cn('flex items-center gap-4 rounded-lg bg-card p-4', className)}>
      <Link href={`/user/${user.id}`}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link href={`/user/${user.id}`} className="font-medium text-foreground hover:underline">
            {user.username}
          </Link>
          {user.isVerified && (
            <CheckCircle className="h-4 w-4 text-primary fill-primary/20" />
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {user.rating.toFixed(1)} ({user.reviewCount})
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {user.location}
          </span>
        </div>
      </div>
      {showFollowButton && (
        <Button variant="outline" size="sm">
          Follow
        </Button>
      )}
    </div>
  )
}

interface UserAvatarProps {
  user: User
  size?: 'sm' | 'md' | 'lg'
  showRating?: boolean
  className?: string
}

export function UserAvatar({ user, size = 'md', showRating = false, className }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Link href={`/user/${user.id}`}>
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Link
            href={`/user/${user.id}`}
            className="text-sm font-medium text-foreground hover:underline"
          >
            {user.username}
          </Link>
          {user.isVerified && (
            <CheckCircle className="h-3.5 w-3.5 text-primary fill-primary/20" />
          )}
        </div>
        {showRating && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {user.rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  )
}
