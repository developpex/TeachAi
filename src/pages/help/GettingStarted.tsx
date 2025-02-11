import React from 'react';
import { BookOpen } from 'lucide-react';

export function GettingStarted() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Getting Started with TeachAI</h3>
            <p className="text-sm text-primary">A comprehensive guide to using our platform</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Account Setup */}
          <div className="bg-mint/5 rounded-lg border-2 border-mint/20 p-6">
            <h4 className="text-lg font-medium text-primary-dark mb-4">Setting Up Your Account</h4>
            <div className="text-primary space-y-4">
              <p>Getting started with TeachAI is simple:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Sign up using your email address or Google account</li>
                <li>Complete your profile by adding your name and title (e.g., Ms. Smith, Mr. Johnson)</li>
                <li>Verify your email address to access all features</li>
                <li>Choose your subscription plan - start with our free tier or try our 30-day trial</li>
              </ul>
            </div>
          </div>

          {/* Using AI Tools */}
          <div className="bg-mint/5 rounded-lg border-2 border-mint/20 p-6">
            <h4 className="text-lg font-medium text-primary-dark mb-4">Using AI Teaching Tools</h4>
            <div className="text-primary space-y-4">
              <p>Our AI tools are designed to streamline your teaching workflow:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access tools from the dashboard or tools page</li>
                <li>Select a tool based on your needs</li>
                <li>Fill in the required information in the tool's form</li>
                <li>Review and customize the AI-generated content</li>
                <li>Save or export your work in various formats</li>
              </ul>
              <p>Tips for best results:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Be specific with your requirements</li>
                <li>Include grade level and subject information</li>
                <li>Use follow-up prompts to refine the output</li>
              </ul>
            </div>
          </div>

          {/* Using Chat */}
          <div className="bg-mint/5 rounded-lg border-2 border-mint/20 p-6">
            <h4 className="text-lg font-medium text-primary-dark mb-4">Collaborating in Chat</h4>
            <div className="text-primary space-y-4">
              <p>Connect with other educators through our chat channels:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Join subject-specific channels (e.g., Math, Science, Language Arts)</li>
                <li>Participate in grade-level discussions</li>
                <li>Share teaching strategies and resources</li>
                <li>Get real-time support from other teachers</li>
              </ul>
              <p>Chat features include:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Real-time messaging</li>
                <li>Channel-based organization</li>
                <li>File and resource sharing</li>
                <li>Search functionality to find previous discussions</li>
              </ul>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-mint/5 rounded-lg border-2 border-mint/20 p-6">
            <h4 className="text-lg font-medium text-primary-dark mb-4">Best Practices</h4>
            <div className="text-primary space-y-4">
              <p>Make the most of TeachAI with these tips:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Start with the free tools to familiarize yourself with the platform</li>
                <li>Use the AI tools as a starting point and customize the output</li>
                <li>Join relevant chat channels to connect with peers</li>
                <li>Keep your profile updated for better collaboration</li>
                <li>Check our FAQ section for common questions</li>
                <li>Its Ai generated so always check the response before using it</li>
              </ul>
            </div>
          </div>

          {/* Support */}
          <div className="bg-mint/5 rounded-lg border-2 border-mint/20 p-6">
            <h4 className="text-lg font-medium text-primary-dark mb-4">Getting Support</h4>
            <div className="text-primary space-y-4">
              <p>We're here to help you succeed:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Visit our FAQ section for quick answers</li>
                <li>Submit support tickets for technical issues</li>
                <li>Join the #help channel in chat for community support</li>
                <li>Contact our support team for personalized assistance</li>
                <li>Check our blog for tips and updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}