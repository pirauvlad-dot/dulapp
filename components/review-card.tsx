import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Review } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ReviewCardProps {
  review: Review
  className?: string
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={cn('flex gap-4 rounded-lg bg-card p-4', className)}>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={review.reviewer.avatar} alt={review.reviewer.username} />
        <AvatarFallback>{review.reviewer.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-foreground">{review.reviewer.username}</span>
          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
        </div>
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5',
                i < review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-muted text-muted'
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
        {review.listingTitle && (
          <p className="mt-2 text-xs text-muted-foreground">
            Purchased: <span className="font-medium">{review.listingTitle}</span>
          </p>
        )}
      </div>
    </div>
  )
}

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = true,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.round(rating)
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          )}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}
