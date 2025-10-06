import { User } from '../types';

interface MatchResult {
  mentor: User;
  matchScore: number;
  reason: string;
  matchDetails: {
    skillMatch: number;
    experienceMatch: number;
    goalAlignment: number;
    availability: boolean;
  };
}

/**
 * AI-powered mentorship matching algorithm
 * Matches students with mentors based on skills, experience, and career goals
 */
export class MentorshipMatcher {
  /**
   * Calculate match score between a student and potential mentor
   */
  static calculateMatchScore(student: User, mentor: User): MatchResult {
    let totalScore = 0;
    const weights = {
      skills: 0.4,
      experience: 0.3,
      goals: 0.2,
      availability: 0.1,
    };

    // 1. Skill Match (40%)
    const skillMatch = this.calculateSkillMatch(student, mentor);
    totalScore += skillMatch * weights.skills;

    // 2. Experience Match (30%)
    const experienceMatch = this.calculateExperienceMatch(student, mentor);
    totalScore += experienceMatch * weights.experience;

    // 3. Goal Alignment (20%)
    const goalAlignment = this.calculateGoalAlignment(student, mentor);
    totalScore += goalAlignment * weights.goals;

    // 4. Availability (10%)
    const availability = mentor.mentorProfile?.isAvailable || false;
    const availabilityScore = availability ? 100 : 0;
    totalScore += availabilityScore * weights.availability;

    // Generate match reason
    const reason = this.generateMatchReason(student, mentor, {
      skillMatch,
      experienceMatch,
      goalAlignment,
      availability,
    });

    return {
      mentor,
      matchScore: Math.round(totalScore),
      reason,
      matchDetails: {
        skillMatch: Math.round(skillMatch),
        experienceMatch: Math.round(experienceMatch),
        goalAlignment: Math.round(goalAlignment),
        availability,
      },
    };
  }

  /**
   * Calculate skill overlap between student and mentor
   */
  private static calculateSkillMatch(student: User, mentor: User): number {
    const studentSkills = student.profile?.skills || [];
    const mentorExpertise = mentor.mentorProfile?.expertiseAreas || [];

    if (studentSkills.length === 0 || mentorExpertise.length === 0) {
      return 0;
    }

    // Find overlapping skills
    const overlappingSkills = studentSkills.filter((skill) =>
      mentorExpertise.some((expertise) =>
        expertise.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(expertise.toLowerCase())
      )
    );

    // Calculate percentage match
    const matchPercentage = (overlappingSkills.length / studentSkills.length) * 100;
    return Math.min(matchPercentage, 100);
  }

  /**
   * Calculate experience relevance
   */
  private static calculateExperienceMatch(student: User, mentor: User): number {
    const studentGoals = Array.isArray(student.careerGoals) ? student.careerGoals : (student.careerGoals ? [student.careerGoals] : []);
    const mentorExperience = mentor.experience || [];

    if (studentGoals.length === 0 || mentorExperience.length === 0) {
      return 50; // Neutral score if data is missing
    }

    let matchScore = 0;

    // Check if mentor's experience aligns with student's career goals
    studentGoals.forEach((goal: string) => {
      const goalLower = goal.toLowerCase();
      mentorExperience.forEach((exp) => {
        const titleMatch = exp.title.toLowerCase().includes(goalLower) ||
                          goalLower.includes(exp.title.toLowerCase());
        const companyMatch = exp.company && (
          exp.company.toLowerCase().includes(goalLower) ||
          goalLower.includes(exp.company.toLowerCase())
        );
        
        if (titleMatch || companyMatch) {
          matchScore += 30;
        }
      });
    });

    return Math.min(matchScore, 100);
  }

  /**
   * Calculate career goal alignment
   */
  private static calculateGoalAlignment(student: User, mentor: User): number {
    const studentGoals = Array.isArray(student.careerGoals) ? student.careerGoals : (student.careerGoals ? [student.careerGoals] : []);
    const studentInterests = student.profile?.interests || [];
    const mentorAchievements = mentor.mentorProfile?.achievements || [];
    const mentorExpertise = mentor.mentorProfile?.expertiseAreas || [];

    if (studentGoals.length === 0 && studentInterests.length === 0) {
      return 50; // Neutral score
    }

    let alignmentScore = 0;
    const allStudentGoals = [...studentGoals, ...studentInterests];
    const allMentorExpertise = [...mentorExpertise, ...mentorAchievements];

    allStudentGoals.forEach((goal: string) => {
      const goalLower = goal.toLowerCase();
      allMentorExpertise.forEach((expertise: string) => {
        const expertiseLower = expertise.toLowerCase();
        
        // Check for partial matches
        if (expertiseLower.includes(goalLower) || goalLower.includes(expertiseLower)) {
          alignmentScore += 25;
        }
      });
    });

    return Math.min(alignmentScore, 100);
  }

  /**
   * Generate human-readable match reason
   */
  private static generateMatchReason(
    student: User,
    mentor: User,
    scores: {
      skillMatch: number;
      experienceMatch: number;
      goalAlignment: number;
      availability: boolean;
    }
  ): string {
    const reasons: string[] = [];

    // Skill-based reasons
    if (scores.skillMatch > 70) {
      const commonSkills = this.findCommonSkills(student, mentor);
      if (commonSkills.length > 0) {
        reasons.push(`Strong expertise in ${commonSkills.slice(0, 3).join(', ')}`);
      }
    }

    // Experience-based reasons
    if (scores.experienceMatch > 70) {
      const relevantExp = mentor.experience?.[0];
      if (relevantExp) {
        reasons.push(`${relevantExp.title} experience at ${relevantExp.company || 'top companies'}`);
      }
    }

    // Goal alignment reasons
    if (scores.goalAlignment > 70) {
      const studentGoal = student.careerGoals?.[0];
      if (studentGoal) {
        reasons.push(`Aligned with your goal: ${studentGoal}`);
      }
    }

    // Availability
    if (scores.availability) {
      const maxMentees = mentor.mentorProfile?.maxMentees || 5;
      reasons.push(`Available for mentorship (accepts up to ${maxMentees} mentees)`);
    }

    return reasons.length > 0
      ? reasons.join(' • ')
      : 'Compatible background and interests';
  }

  /**
   * Find common skills between student and mentor
   */
  private static findCommonSkills(student: User, mentor: User): string[] {
    const studentSkills = student.profile?.skills || [];
    const mentorExpertise = mentor.mentorProfile?.expertiseAreas || [];

    return studentSkills.filter((skill) =>
      mentorExpertise.some((expertise) =>
        expertise.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(expertise.toLowerCase())
      )
    );
  }

  /**
   * Get recommended mentors for a student
   */
  static getRecommendedMentors(
    student: User,
    allMentors: User[],
    limit = 10
  ): MatchResult[] {
    // Filter only available mentors
    const availableMentors = allMentors.filter(
      (mentor) =>
        mentor.id !== student.id &&
        mentor.mentorProfile?.isAvailable === true &&
        (mentor.role === 'alumni' || mentor.role === 'faculty')
    );

    // Calculate match scores for all mentors
    const matchResults = availableMentors.map((mentor) =>
      this.calculateMatchScore(student, mentor)
    );

    // Sort by match score (descending) and return top matches
    return matchResults
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }

  /**
   * Find the best mentor for specific skills
   */
  static findMentorForSkills(
    skills: string[],
    allMentors: User[],
    limit = 5
  ): Array<{ mentor: User; matchingSkills: string[] }> {
    const mentorMatches = allMentors
      .filter((mentor) => mentor.mentorProfile?.isAvailable)
      .map((mentor) => {
        const expertise = mentor.mentorProfile?.expertiseAreas || [];
        const matchingSkills = skills.filter((skill) =>
          expertise.some((exp) =>
            exp.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(exp.toLowerCase())
          )
        );

        return { mentor, matchingSkills };
      })
      .filter((match) => match.matchingSkills.length > 0)
      .sort((a, b) => b.matchingSkills.length - a.matchingSkills.length);

    return mentorMatches.slice(0, limit);
  }
}

export default MentorshipMatcher;
