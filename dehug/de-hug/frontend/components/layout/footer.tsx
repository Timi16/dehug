import Link from "next/link"
import { Brain, Github, Twitter, Mail, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              
              <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="font-light text-2xl text-white">DeHug</span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Enterprise-grade decentralized AI platform for mission-critical applications.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-6 text-white">Platform</h3>
            <ul className="space-y-3 text-slate-400 font-light">
              <li><Link href="/models" className="hover:text-white transition-colors">AI Models</Link></li>
              <li><Link href="/datasets" className="hover:text-white transition-colors">Datasets</Link></li>
              <li><Link href="/upload" className="hover:text-white transition-colors">Deploy</Link></li>
              <li><Link href="/insights" className="hover:text-white transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-6 text-white">Enterprise</h3>
            <ul className="space-y-3 text-slate-400 font-light">
              <li><Link href="/enterprise" className="hover:text-white transition-colors">Solutions</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-6 text-white">Resources</h3>
            <ul className="space-y-3 text-slate-400 font-light">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 font-light">
          <p>&copy; 2025 DeHug. Enterprise AI infrastructure built on decentralized technology.</p>
        </div>
      </div>
    </footer>
  )
}
