'use client'
import { ThumbsDownIcon } from '@root/icons/ThumbsDownIcon/index'
import { ThumbsUpIcon } from '@root/icons/ThumbsUpIcon/index'
import React from 'react'

import classes from './index.module.scss'

type Vote = 'helpful' | 'notHelpful'

const storageKey = (path: string) => `docs-feedback:${path}`

export const DocsFeedback: React.FC<{ path: string }> = ({ path }) => {
  const [voted, setVoted] = React.useState<boolean>(false)

  React.useEffect(() => {
    try {
      if (window.localStorage.getItem(storageKey(path))) {
        setVoted(true)
      }
    } catch {
      // localStorage unavailable — fall back to allowing a vote
    }
  }, [path])

  const handleVote = (vote: Vote) => {
    // Optimistically lock the widget; the request is best-effort.
    setVoted(true)
    try {
      window.localStorage.setItem(storageKey(path), vote)
    } catch {
      // ignore storage failures
    }

    void fetch('/api/docs-feedback/vote', {
      body: JSON.stringify({ path, vote }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }).catch(() => {
      // best-effort; nothing to do on failure
    })
  }

  if (voted) {
    return (
      <div className={classes.feedback}>
        <p className={classes.thanks}>Thanks for your feedback!</p>
      </div>
    )
  }

  return (
    <div className={classes.feedback}>
      <p className={classes.prompt}>Was this page helpful?</p>
      <div className={classes.buttons}>
        <button
          aria-label="Yes, this page was helpful"
          className={classes.button}
          onClick={() => handleVote('helpful')}
          type="button"
        >
          <ThumbsUpIcon className={classes.icon} />
        </button>
        <button
          aria-label="No, this page was not helpful"
          className={classes.button}
          onClick={() => handleVote('notHelpful')}
          type="button"
        >
          <ThumbsDownIcon className={classes.icon} />
        </button>
      </div>
    </div>
  )
}
