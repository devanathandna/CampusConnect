import { User, Event } from '../types';

interface EventRecommendation {
  event: Event;
  matchScore: number;
  reason: string;
}

/**
 * AI-powered event recommendation system
 * Recommends events based on user interests, major, and attendance history
 */
export class EventRecommendationEngine {
  /**
   * Calculate match score between user and event
   */
  static calculateEventMatch(user: User, event: Event): EventRecommendation {
    let totalScore = 0;
    const weights = {
      interests: 0.35,
      major: 0.25,
      category: 0.20,
      connections: 0.15,
      tags: 0.05,
    };

    // 1. Interest Match (35%)
    const interestMatch = this.calculateInterestMatch(user, event);
    totalScore += interestMatch * weights.interests;

    // 2. Major/Department Match (25%)
    const majorMatch = this.calculateMajorMatch(user, event);
    totalScore += majorMatch * weights.major;

    // 3. Category Preference (20%)
    const categoryMatch = this.calculateCategoryMatch(user, event);
    totalScore += categoryMatch * weights.category;

    // 4. Connections Attending (15%)
    const connectionMatch = this.calculateConnectionMatch(user, event);
    totalScore += connectionMatch * weights.connections;

    // 5. Tag Match (5%)
    const tagMatch = this.calculateTagMatch(user, event);
    totalScore += tagMatch * weights.tags;

    // Generate recommendation reason
    const reason = this.generateRecommendationReason(user, event, {
      interestMatch,
      majorMatch,
      categoryMatch,
      connectionMatch,
    });

    return {
      event,
      matchScore: Math.round(totalScore),
      reason,
    };
  }

  /**
   * Match user interests with event description and title
   */
  private static calculateInterestMatch(user: User, event: Event): number {
    const userInterests = user.profile?.interests || [];
    if (userInterests.length === 0) return 50;

    const eventText = `${event.title} ${event.description}`.toLowerCase();
    let matchCount = 0;

    userInterests.forEach((interest) => {
      if (eventText.includes(interest.toLowerCase())) {
        matchCount++;
      }
    });

    return Math.min((matchCount / userInterests.length) * 100, 100);
  }

  /**
   * Match user major/department with event category
   */
  private static calculateMajorMatch(user: User, event: Event): number {
    const userMajor = user.profile?.major?.toLowerCase() || '';
    const userDepartment = user.profile?.department?.toLowerCase() || '';
    const eventCategory = event.category?.toLowerCase() || '';
    const eventTitle = event.title.toLowerCase();

    if (!userMajor && !userDepartment) return 50;

    // Check if major/department is mentioned in event
    if (
      eventTitle.includes(userMajor) ||
      eventTitle.includes(userDepartment) ||
      eventCategory.includes(userMajor) ||
      eventCategory.includes(userDepartment)
    ) {
      return 100;
    }

    // Partial match
    const majorWords = userMajor.split(' ');
    const departmentWords = userDepartment.split(' ');
    const allWords = [...majorWords, ...departmentWords];

    let partialMatch = 0;
    allWords.forEach((word) => {
      if (word.length > 3 && (eventTitle.includes(word) || eventCategory.includes(word))) {
        partialMatch += 25;
      }
    });

    return Math.min(partialMatch, 100);
  }

  /**
   * Calculate category preference based on attendance history
   */
  private static calculateCategoryMatch(user: User, event: Event): number {
    // In a real implementation, this would check user's event attendance history
    // For now, we'll use a simplified approach based on user stats
    const eventsAttended = user.gamification?.stats?.eventsAttended || 0;
    
    if (eventsAttended === 0) return 50; // Neutral for new users

    // Could be enhanced to track which categories user prefers
    return 70; // Default preference score
  }

  /**
   * Check if user's connections are attending
   */
  private static calculateConnectionMatch(user: User, event: Event): number {
    const userConnections = user.connections || [];
    const eventAttendees = event.attendees || [];

    if (userConnections.length === 0 || eventAttendees.length === 0) return 0;

    // Find connections who are attending
    const attendingConnections = eventAttendees.filter((attendee) =>
      userConnections.some((conn: any) => 
        conn.id === attendee.user.toString() || conn.id === attendee.user
      )
    );

    if (attendingConnections.length === 0) return 0;

    // More connections = higher score
    return Math.min((attendingConnections.length / 5) * 100, 100);
  }

  /**
   * Match event tags with user skills/interests
   */
  private static calculateTagMatch(user: User, event: Event): number {
    const userSkills = user.profile?.skills || [];
    const eventTags = event.tags || [];

    if (userSkills.length === 0 || eventTags.length === 0) return 0;

    const matchingTags = eventTags.filter((tag) =>
      userSkills.some((skill) =>
        tag.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(tag.toLowerCase())
      )
    );

    return Math.min((matchingTags.length / eventTags.length) * 100, 100);
  }

  /**
   * Generate human-readable recommendation reason
   */
  private static generateRecommendationReason(
    user: User,
    event: Event,
    scores: {
      interestMatch: number;
      majorMatch: number;
      categoryMatch: number;
      connectionMatch: number;
    }
  ): string {
    const reasons: string[] = [];

    // Interest-based
    if (scores.interestMatch > 70) {
      const matchingInterest = user.profile?.interests?.find((interest) =>
        event.title.toLowerCase().includes(interest.toLowerCase()) ||
        event.description.toLowerCase().includes(interest.toLowerCase())
      );
      if (matchingInterest) {
        reasons.push(`Matches your interest in ${matchingInterest}`);
      }
    }

    // Major-based
    if (scores.majorMatch > 80) {
      const major = user.profile?.major || user.profile?.department;
      if (major) {
        reasons.push(`Relevant to ${major}`);
      }
    }

    // Connection-based
    if (scores.connectionMatch > 50) {
      const attendingCount = Math.ceil(scores.connectionMatch / 20);
      reasons.push(`${attendingCount}+ of your connections are attending`);
    }

    // Category-based
    if (event.category) {
      reasons.push(`${event.category} event`);
    }

    return reasons.length > 0
      ? reasons.join(' • ')
      : 'Recommended based on your profile';
  }

  /**
   * Get recommended events for a user
   */
  static getRecommendedEvents(
    user: User,
    allEvents: Event[],
    limit = 10
  ): EventRecommendation[] {
    // Filter upcoming events only
    const upcomingEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.startDate);
      return eventDate > new Date();
    });

    // Calculate match scores
    const recommendations = upcomingEvents.map((event) =>
      this.calculateEventMatch(user, event)
    );

    // Sort by match score and return top recommendations
    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Get trending events based on RSVP and attendance
   */
  static getTrendingEvents(allEvents: Event[], limit = 5): Event[] {
    return allEvents
      .filter((event) => new Date(event.startDate) > new Date())
      .sort((a, b) => {
        const aScore = (a.attendees?.length || 0) + (a.capacity ? (a.attendees?.length || 0) / a.capacity : 0);
        const bScore = (b.attendees?.length || 0) + (b.capacity ? (b.attendees?.length || 0) / b.capacity : 0);
        return bScore - aScore;
      })
      .slice(0, limit);
  }
}

export default EventRecommendationEngine;
